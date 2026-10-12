"use client";

import { useEffect, useState } from "react";

const ACTIVITY = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart", "scroll"];

// True once the visitor has done nothing (no pointer, key, wheel, touch or
// scroll) for `ms`; false again on the next activity. False on the server
// and on the first render, so hydration matches.
const useIdle = (ms) => {
  const [idle, setIdle] = useState(false);

  useEffect(() => {
    let last = Date.now();
    const onActivity = () => {
      last = Date.now();
      setIdle(false);
    };
    const check = setInterval(() => setIdle(Date.now() - last >= ms), 1000);
    ACTIVITY.forEach((type) => window.addEventListener(type, onActivity, { passive: true }));
    return () => {
      clearInterval(check);
      ACTIVITY.forEach((type) => window.removeEventListener(type, onActivity));
    };
  }, [ms]);

  return idle;
};

export default useIdle;
