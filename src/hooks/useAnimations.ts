"use client";

import { useEffect, useCallback } from "react";

export const useAnimations = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".reveal");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const createParallax = useCallback(
    (containerId: string, contentId: string) => {
      const container = document.getElementById(containerId);
      const content = document.getElementById(contentId);

      if (!container || !content) return;

      const handleScroll = () => {
        const rect = container.getBoundingClientRect();
        const scrollProgress = 1 - rect.top / window.innerHeight;

        if (rect.top < window.innerHeight && rect.bottom > 0) {
          content.style.transform = `translateY(${scrollProgress * 50}px)`;
          content.style.opacity = `${Math.max(0, 1 - scrollProgress * 0.5)}`;
        }
      };

      window.addEventListener("scroll", handleScroll);
      handleScroll();

      return () => window.removeEventListener("scroll", handleScroll);
    },
    []
  );

  return { createParallax };
};
