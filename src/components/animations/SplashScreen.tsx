"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherShader from "./WeatherShader";
import SkyForeground from "./SkyForeground";

interface SplashScreenProps {
  onComplete?: () => void;
}

const loadingMessages = [
  "Checking today's skies...",
  "Talking with the clouds...",
  "Preparing your weather companion...",
  "Packing your umbrella...",
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(loadingMessages[0]);
  const [show, setShow] = useState(true);
  const router = useRouter();
  const frameRef = useRef<number>(0);
  const startRef = useRef<number>(0);
  const duration = 4000;
  const msgIndexRef = useRef(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % loadingMessages.length;
      setMessage(loadingMessages[msgIndexRef.current]);
    }, 2500);

    const animate = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        clearInterval(msgInterval);
        setMessage("Ready!");
          setTimeout(() => {
          setShow(false);
          if (onComplete) onComplete();
          else router.push("/dashboard");
        }, 500);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frameRef.current);
      clearInterval(msgInterval);
    };
  }, [onComplete, router]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-aether-bg">
      <WeatherShader className="absolute inset-0 z-0" />
      <SkyForeground state="clear-day" />
      <div className="relative z-30 flex flex-col items-center px-6">
        <div className="w-48 h-48 md:w-64 md:h-64 mb-8 animate-fade-in-up relative" style={{ animationDelay: "0.2s" }}>
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_30px_rgba(201,154,62,0.15)]">
            <defs>
              <radialGradient id="cloudGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="#C99A3E" stop-opacity="0.12"/>
                <stop offset="100%" stop-color="#C99A3E" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#EAE7DD"/>
                <stop offset="100%" stop-color="#C99A3E"/>
              </linearGradient>
              <linearGradient id="cloudGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#EAE7DD" stop-opacity="0.6"/>
                <stop offset="100%" stop-color="#C99A3E" stop-opacity="0.2"/>
              </linearGradient>
              <filter id="cloudBlur">
                <feGaussianBlur stdDeviation="3"/>
              </filter>
            </defs>
            <circle cx="100" cy="90" r="70" fill="url(#cloudGlow)">
              <animate attributeName="r" dur="6s" repeatCount="indefinite" values="65;75;65"/>
            </circle>
            <g opacity="0.3" filter="url(#cloudBlur)">
              <path d="M155 125H70C53.4315 125 40 111.569 40 95C40 78.4315 53.4315 65 70 65C71.4586 65 72.8906 65.1039 74.2882 65.3045C80.2198 42.4578 101.11 26 126 26C152.133 26 174.218 44.885 178.441 69.5262C196.136 73.4315 209.5 89.1481 209.5 108C209.5 128.435 192.935 145 172.5 145H155V125Z" fill="url(#cloudGrad)">
                <animate attributeName="d" dur="12s" repeatCount="indefinite" values="
                  M155 125H70C53.4315 125 40 111.569 40 95C40 78.4315 53.4315 65 70 65C71.4586 65 72.8906 65.1039 74.2882 65.3045C80.2198 42.4578 101.11 26 126 26C152.133 26 174.218 44.885 178.441 69.5262C196.136 73.4315 209.5 89.1481 209.5 108C209.5 128.435 192.935 145 172.5 145H155V125Z;
                  M150 130H65C48.4315 130 35 116.569 35 100C35 83.4315 48.4315 70 65 70C66.4586 70 67.8906 70.1039 69.2882 70.3045C75.2198 47.4578 96.1098 31 121 31C147.133 31 169.218 49.885 173.441 74.5262C191.136 78.4315 204.5 94.1481 204.5 113C204.5 133.435 187.935 150 167.5 150H150V130Z;
                  M155 125H70C43.4315 125 40 111.569 40 95C40 78.4315 53.4315 65 70 65C71.4586 65 72.8906 65.1039 74.2882 65.3045C80.2198 42.4578 101.11 26 126 26C152.133 26 174.218 44.885 178.441 69.5262C196.136 73.4315 209.5 89.1481 209.5 108C209.5 128.435 192.935 145 172.5 145H155V125Z
                "/>
              </path>
            </g>
            <g>
              <path d="M150 130H60C43.4315 130 30 116.569 30 100C30 83.4315 43.4315 70 60 70C61.4586 70 62.8906 70.1039 64.2882 70.3045C70.2198 47.4578 91.1098 31 116 31C142.133 31 164.218 49.885 168.441 74.5262C186.136 78.4315 199.5 94.1481 199.5 113C199.5 133.435 182.935 150 162.5 150H150V130Z" fill="url(#cloudGrad)">
                <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
                  M150 130H60C43.4315 130 30 116.569 30 100C30 83.4315 43.4315 70 60 70C61.4586 70 62.8906 70.1039 64.2882 70.3045C70.2198 47.4578 91.1098 31 116 31C142.133 31 164.218 49.885 168.441 74.5262C186.136 78.4315 199.5 94.1481 199.5 113C199.5 133.435 182.935 150 162.5 150H150V130Z;
                  M155 125H65C48.4315 125 35 111.569 35 95C35 78.4315 48.4315 65 65 65C66.4586 65 67.8906 65.1039 69.2882 65.3045C75.2198 42.4578 96.1098 26 121 26C147.133 26 169.218 44.885 173.441 69.5262C191.136 73.4315 204.5 89.1481 204.5 108C204.5 128.435 187.935 145 167.5 145H155V125Z;
                  M150 130H60C43.4315 130 30 116.569 30 100C30 83.4315 43.4315 70 60 70C61.4586 70 62.8906 70.1039 64.2882 70.3045C70.2198 47.4578 91.1098 31 116 31C142.133 31 164.218 49.885 168.441 74.5262C186.136 78.4315 199.5 94.1481 199.5 113C199.5 133.435 182.935 150 162.5 150H150V130Z
                "/>
              </path>
            </g>
            <g opacity="0.5">
              <path d="M120 80C125 78 135 75 145 80" stroke="#EAE7DD" stroke-width="2" stroke-linecap="round" fill="none">
                <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
                  M120 80C125 78 135 75 145 80;
                  M120 75C125 73 135 70 145 75;
                  M120 80C125 78 135 75 145 80
                "/>
              </path>
            </g>
            <g opacity="0.15">
              <ellipse cx="45" cy="110" rx="12" ry="6" fill="#C99A3E">
                <animate attributeName="rx" dur="10s" repeatCount="indefinite" values="12;15;12"/>
              </ellipse>
              <ellipse cx="160" cy="115" rx="10" ry="5" fill="#C99A3E">
                <animate attributeName="rx" dur="8s" repeatCount="indefinite" values="10;13;10"/>
              </ellipse>
            </g>
          </svg>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-aether-gold animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          Accurate Weather
        </h1>
        <p className="font-caption text-caption text-aether-text-muted mt-2 uppercase tracking-widest animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          Atmospheric Intelligence
        </p>
        <div className="mt-12 w-3/4 max-w-xs h-1 bg-aether-gold/20 rounded-full overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="h-full bg-aether-gold/40 rounded-full animate-wind-current" />
        </div>
        <p className="font-caption text-caption text-aether-text-muted mt-4 min-h-[24px] transition-opacity duration-500">
          {message}
        </p>
      </div>
    </div>
  );
}
