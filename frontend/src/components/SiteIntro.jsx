import { Gamepad2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const INTRO_SEEN_KEY = "playzone:intro-seen";

export default function SiteIntro() {
  const [visible, setVisible] = useState(false);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return undefined;
    hasStarted.current = true;

    if (sessionStorage.getItem(INTRO_SEEN_KEY)) return undefined;

    sessionStorage.setItem(INTRO_SEEN_KEY, "true");
    setVisible(true);
    return undefined;
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timeout = window.setTimeout(() => setVisible(false), reducedMotion ? 250 : 1500);
    return () => window.clearTimeout(timeout);
  }, [visible]);

  if (!visible) return null;

  return (
    <div aria-label="PlayZone yuklanmoqda" className="site-intro" role="status">
      <div className="site-intro__brand">
        <span className="site-intro__icon">
          <Gamepad2 aria-hidden="true" size={30} />
        </span>
        <span className="site-intro__name">PlayZone</span>
      </div>
    </div>
  );
}
