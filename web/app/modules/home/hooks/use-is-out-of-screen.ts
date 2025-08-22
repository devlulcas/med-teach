import { useEffect, useRef, useState } from "react";

export function useIsOutOfScreen() {
  const ref = useRef<HTMLDivElement>(null);

  const [isOutOfScreen, setIsOutOfScreen] = useState(false);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([event]) => setIsOutOfScreen(event.intersectionRatio < 1),
      { threshold: [1], rootMargin: "-1px 0px 0px 0px" }
    );
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isOutOfScreen };
}
