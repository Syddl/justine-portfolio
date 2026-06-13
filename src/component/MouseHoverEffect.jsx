"use client";
import { useEffect, useRef } from "react";

const MouseHoverEffect = () => {
  const ref = useRef(null);

  useEffect(() => {
    let frame = 0;

    const handleMouseMove = (e) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (el) {
          el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(59, 130, 246, 0.15), transparent 40%)`;
        }
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="fixed inset-0 opacity-30 pointer-events-none" />
  );
};

export default MouseHoverEffect;
