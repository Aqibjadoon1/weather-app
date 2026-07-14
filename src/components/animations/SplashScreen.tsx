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
      <ThreeScene className="absolute inset-0 z-10 opacity-90 pointer-events-none" variant="sun" sunPosition={[3, 3, -5]} />
      <div className="relative z-30 flex flex-col items-center px-6 mt-32 md:mt-48">
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
