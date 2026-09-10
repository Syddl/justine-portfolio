"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// Degrees of tilt at the card's edge. The centre is flat; the further the
// pointer is from it, the more the card leans away, like a plate balanced on
// a finger. The spring is deliberately under-damped so it settles with a
// little weight instead of snapping.
const MAX_TILT = 9;
const SPRING = { stiffness: 140, damping: 16, mass: 0.9 };

// Pointer-driven 3D tilt for a card. Only the transform changes, so the
// markup is identical on the server and the first client render. Touch
// pointers are ignored (no hover on a phone, and a drag should scroll), and
// reduced-motion visitors get a card that simply does not tilt.
const TiltCard = ({ children, className = "" }) => {
  const prefersReducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, SPRING);
  const springY = useSpring(rotateY, SPRING);

  const onPointerMove = (e) => {
    if (prefersReducedMotion || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * MAX_TILT * 2);
    rotateX.set(-y * MAX_TILT * 2);
  };

  const rest = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={rest}
      style={{ rotateX: springX, rotateY: springY, transformPerspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;
