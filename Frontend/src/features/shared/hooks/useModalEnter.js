import { useEffect, useRef } from "react";
import gsap from "gsap";

// Attach the returned ref to a modal/popup box to give it a soft
// scale+fade entrance instead of an instant CSS toggle.
export const useModalEnter = (deps = []) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.92, y: 10 },
      { opacity: 1, scale: 1, y: 0, duration: 0.25, ease: "power2.out" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
};
