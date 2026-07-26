import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
    });

    const onFrame = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onFrame);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onFrame);
      lenis.destroy();
    };
  }, []);
};
