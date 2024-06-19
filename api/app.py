import datetime
from flask import Flask, Response, jsonify
from flask_cors import CORS
import cv2
import firebase_admin
from firebase_admin import credentials, storage, firestore
import face_recognition
from io import BytesIO
import numpy as np
import requests
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enable CORS for all routes and origins

# Initialize Firebase
cred = credentials.Certificate("key/facescan-e8063-firebase-adminsdk-u9ifc-0681c84726.json")
firebase_admin.initialize_app(cred, {
    'storageBucket': "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
})

db = firestore.client()
bucket = storage.bucket()

# Global variables
frame = None
face_rects = []
known_face_encodings = []
known_face_data = []

# Load known faces from Firestore Storage
def load_known_faces():
    global known_face_encodings, known_face_data
    known_face_encodings = []
    known_face_data = []

    users_ref = db.collection('Employee')
    docs = users_ref.stream()
    for doc in docs:
        user_data = doc.to_dict()
        name = user_data.get('name')
        image_url = user_data.get('fotoURL')
        id = user_data.get('id') 
        if not name or not image_url:
            print(f"Skipping document {doc.id}: Missing 'name' or 'fotoURL'")
            continue

        try:
            # Check if the URL is properly formatted
            if not image_url.startswith("http"):
                raise ValueError("Invalid URL format")

            # Load the image from the provided URL and get the face encoding
            response = requests.get(image_url)
            response.raise_for_status()  # Raise an error for non-200 status codes
            image = face_recognition.load_image_file(BytesIO(response.content))
            face_encoding = face_recognition.face_encodings(image)
            if face_encoding:
                known_face_encodings.append(face_encoding[0])
                known_face_data.append({
                    'employeeId': id,  # Use 'id' from the document
                    'name': name
                })
            print(f"Loaded face encoding for {name}")
        except Exception as e:
            print(f"Error loading image from URL {image_url}: {e}")
            continue

load_known_faces()

# Function to detect and recognize faces
def detect_and_recognize_faces(frame):
    global known_face_encodings, known_face_data
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    face_locations = face_recognition.face_locations(rgb_frame)
    face_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
    
    for (top, right, bottom, left), face_encoding in zip(face_locations, face_encodings):
        matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
        name = "Unknown"
        employee_id = None

        face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
        best_match_index = np.argmin(face_distances)
        if matches[best_match_index]:
            name = known_face_data[best_match_index]['name']
            employee_id = known_face_data[best_match_index]['employeeId']

            # Mark attendance in Firestore
            mark_attendance(name, employee_id)

        cv2.rectangle(frame, (left, top), (right, bottom), (0, 255, 0), 2)
        cv2.putText(frame, name, (left, top - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 255, 255), 2)

# Mark attendance in Firestore
def mark_attendance(name, employee_id):
    try:
        today = datetime.datetime.today().strftime('%Y-%m-%d')
        now = datetime.datetime.now().strftime('%H:%M:%S')
        attendance_ref = db.collection('attendance').document(today)
        attendance_ref.set({
            'present': True,
            'name': name,
            'date': today,
            'id': employee_id,
            'clockedIn': now
        }, merge=True)
    except Exception as e:
        print(f"Error marking attendance for {name}: {e}")

# Function to generate frames for video streaming
def generate_frames():
    global frame, face_rects
    camera = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    
    while True:
        success, frame = camera.read()
        if not success:
            break
        else:
            detect_and_recognize_faces(frame)
            ret, buffer = cv2.imencode('.jpg', frame)
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# Endpoint to stream video feed
@app.route('/api/video_feed')
def video_feed():
    try:
        return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
