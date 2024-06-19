import { auth } from "@/app/firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export function useUserSession(InitSession: string | null){
    const [ userId, setUserId ] = useState<string | null>(InitSession);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUserId(authUser.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return userId;
}