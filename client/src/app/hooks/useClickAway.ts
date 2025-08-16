import { useEffect } from "react";

const useClickAway = (
  safeRefs: Array<React.RefObject<HTMLElement>>,
  onAway: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handler = (event: MouseEvent | TouchEvent) => {
      const clickedElement = event.target as Node | null;
      const clickedInside: boolean = safeRefs.some(ref => {
        const safeElement: HTMLElement | null = ref.current;
        return safeElement && (safeElement === clickedElement || (clickedElement instanceof Node && safeElement.contains(clickedElement)));
      });
      if (!clickedInside) {
        onAway();
      }
    }

    document.addEventListener("mousedown", handler, true);

    return () => {
      document.removeEventListener("mousedown", handler, true);
    }
  }, [safeRefs, onAway, enabled]);
}

export default useClickAway;
