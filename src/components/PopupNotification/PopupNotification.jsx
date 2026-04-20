import React, { useEffect, useRef } from "react";
import "./PopupNotification.css";

/**
 * PopupNotification Component
 * 
 * Displays a temporary popup message with auto-dismiss functionality
 * Positioned absolutely with custom top/left coordinates
 * Auto-closes after specified duration or when parent requests closure
 * 
 * Common uses:
 * - Displaying blocked challenge messages (e.g., "Read instructions first")
 * - Showing error notifications
 * - Temporary status messages on user interaction
 * - Context-aware popups with dynamic positioning
 * 
 * @param {string} message - Text message to display in popup
 * @param {Object} position - Positioning object with top and left properties (in pixels)
 * @param {number} position.top - Vertical position from top of screen
 * @param {number} position.left - Horizontal position from left of screen
 * @param {Function} onClose - Callback function triggered when popup closes (auto or manual)
 * @param {number} [duration=800] - Auto-dismiss delay in milliseconds (default 800ms)
 * @returns {JSX.Element} Positioned popup div with message content
 */
export const PopupNotification = ({ message, position, onClose, duration = 800 }) => {
  // Ref to store timeout ID for cleanup and manual cancellation
  const timerRef = useRef(null);

  /**
   * Auto-dismiss effect - sets timer to close popup after duration
   * Dependencies allow duration changes to reset timer
   * Cleanup prevents memory leaks by clearing timeout on unmount or prop changes
   */
  useEffect(() => {
    // Clear any existing timeout before setting a new one
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Set timer to automatically close popup after specified duration
    timerRef.current = setTimeout(() => {
      onClose();
    }, duration);

    // Cleanup function - clears timeout when component unmounts or props change
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [message, onClose, duration]);

  // Render positioned popup notification with message content
  return (
    // Popup container - positioned absolutely using dynamic top/left coordinates
    <div
      className="popup-notification"
      style={{
        // Vertical position - defaults to 0 if not provided
        top: `${position?.top || 0}px`,
        // Horizontal position - defaults to 0 if not provided
        left: `${position?.left || 0}px`,
      }}
    >
      {/* Content wrapper for popup message */}
      <div className="popup-content">
        {/* Display the notification message */}
        <p>{message}</p>
      </div>
    </div>
  );
};

