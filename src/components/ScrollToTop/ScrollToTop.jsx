import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls the page to the top whenever the user navigates to a different route.
 * This improves user experience by ensuring that when changing pages, the view starts from
 * the top instead of maintaining the scroll position from the previous page.
 * 
 * This is a non-rendering component (returns null) that only manages side effects.
 * 
 * @component
 * @returns {null} This component does not render any visible elements
 */
export const ScrollToTop = () => {
  // Get the current pathname from React Router
  // This hook provides the current location/route path
  const { pathname } = useLocation();

  /**
   * Effect: Scroll to top when route changes
   * Dependencies: [pathname] - runs whenever the pathname changes (user navigates)
   * Action: Scroll window to position (0, 0) which is the top-left of the page
   */
  useEffect(() => {
    // Scroll to the top of the page when route changes
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run this effect whenever the route pathname changes

  // This component doesn't render any visible HTML elements
  return null;
};
