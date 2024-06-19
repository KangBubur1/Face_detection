"use client"
import { useState } from 'react';
import { TypewriterEffect } from './ui/typewriter-effect';


const FaceScan: React.FC = () => {
    const [imageSrc, setImageSrc] = useState('http://localhost:5000/api/video_feed');

    const words = [
            {
            text: "Hi!",
            },
            {
            text: "Please",
            },
            {
            text: "Scan",
            },
            {
            text: "Your",
            },
            {
            text: "Face.",
            className: "text-blue-500 dark:text-blue-500",
            },
    
    ]

    return (
        <section className="flex flex-col mt-48 items-center">
            <TypewriterEffect words={words} />
            {/* Camera Box */}
            <div className="w-80 h-80 sm:w-96 sm:h-96 mt-24 ">
                <img src={imageSrc} alt="Live Stream" aria-label='Face Scan' />
            </div>

            <a  href='/Admin'
                className="fixed bottom-5 right-5 bg-slate-800 no-underline group cursor-pointer  shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block">
                <span className="absolute inset-0 overflow-hidden rounded-full">
                    <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </span>
                <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
                    <span>
                    Admin
                    </span>
                    <svg
                    fill="none"
                    height="16"
                    viewBox="0 0 24 24"
                    width="16"
                    xmlns="http://www.w3.org/2000/svg"
                    >
                    <path
                        d="M10.75 8.75L14.25 12L10.75 15.25"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                    />
                    </svg>
                </div>
                <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
            </a>
        </section>
    );
}

export default FaceScan;
