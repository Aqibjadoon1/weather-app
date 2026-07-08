"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import WeatherShader from "./WeatherShader";
import ThreeScene from "./ThreeScene";

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
          else router.push("/login");
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-primary-fixed">
      <WeatherShader className="absolute inset-0 z-0" />
      <ThreeScene className="absolute inset-0 z-10 opacity-90 pointer-events-none" variant="sun" sunPosition={[3, 3, -5]} />
      <div className="relative z-30 flex flex-col items-center px-6">
        <div className="w-48 h-48 md:w-64 md:h-64 mb-8 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g id="cloud">
              <path
                d="M150 130H60C43.4315 130 30 116.569 30 100C30 83.4315 43.4315 70 60 70C61.4586 70 62.8906 70.1039 64.2882 70.3045C70.2198 47.4578 91.1098 31 116 31C142.133 31 164.218 49.885 168.441 74.5262C186.136 78.4315 199.5 94.1481 199.5 113C199.5 133.435 182.935 150 162.5 150H150V130Z"
                fill="white"
              >
                <animate
                  attributeName="d"
                  dur="10s"
                  repeatCount="indefinite"
                  values="
                    M150 130H60C43.4315 130 30 116.569 30 100C30 83.4315 43.4315 70 60 70C61.4586 70 62.8906 70.1039 64.2882 70.3045C70.2198 47.4578 91.1098 31 116 31C142.133 31 164.218 49.885 168.441 74.5262C186.136 78.4315 199.5 94.1481 199.5 113C199.5 133.435 182.935 150 162.5 150H150V130Z;
                    M155 125H65C48.4315 125 35 111.569 35 95C35 78.4315 48.4315 65 65 65C66.4586 65 67.8906 65.1039 69.2882 65.3045C75.2198 42.4578 96.1098 26 121 26C147.133 26 169.218 44.885 173.441 69.5262C191.136 73.4315 204.5 89.1481 204.5 108C204.5 128.435 187.935 145 167.5 145H155V125Z;
                    M150 130H60C43.4315 130 30 116.569 30 100C30 83.4315 43.4315 70 60 70C61.4586 70 62.8906 70.1039 64.2882 70.3045C70.2198 47.4578 91.1098 31 116 31C142.133 31 164.218 49.885 168.441 74.5262C186.136 78.4315 199.5 94.1481 199.5 113C199.5 133.435 182.935 150 162.5 150H150V130Z
                  "
                />
              </path>
            </g>
            <circle cx="116" cy="85" fill="currentColor" fillOpacity="0.3" className="text-white">
              <animate attributeName="r" dur="4s" repeatCount="indefinite" values="50;55;50" />
            </circle>
          </svg>
        </div>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-primary animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          Aether Weather
        </h1>
        <p className="font-caption text-caption text-on-surface-variant mt-2 uppercase tracking-widest animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          Atmospheric Intelligence
        </p>
        <div className="mt-12 w-3/4 max-w-xs h-1 bg-surface-variant rounded-full overflow-hidden animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="h-full bg-primary/40 rounded-full animate-wind-current" />
        </div>
        <p className="font-caption text-caption text-on-surface-variant mt-4 min-h-[24px] transition-opacity duration-500">
          {message}
        </p>
      </div>
    </div>
  );
}
