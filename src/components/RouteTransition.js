import React, { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import "./RouteTransition.css";

/**
 * Wraps the routed page so navigation reads as a soft cross-fade instead of a
 * hard swap. Two things make it feel abrupt otherwise:
 *
 *  - the browser keeps the old scroll position, so a click from halfway down
 *    Home can land mid-page on About,
 *  - the new page paints in a single frame with no easing.
 *
 * Keying on pathname remounts the wrapper on every navigation, which restarts
 * the CSS animation. The animation itself sits on the children rather than the
 * wrapper so a lazy route eases in twice over: once for its shimmer fallback,
 * again when the real page replaces it.
 */
function RouteTransition({ children }) {
  const { pathname } = useLocation();

  // Before paint, so the new page is never briefly visible at the old offset.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <main className="route-view" key={pathname}>
      {children}
    </main>
  );
}

export default RouteTransition;
