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
          // amber-300 at 6%: warm and dim, the one accent the page already uses
          el.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(252, 211, 77, 0.06), transparent 40%)`;
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
