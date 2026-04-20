// Import React hooks for component rendering and side effects
import React, { useEffect } from "react";
// Import translation hook for multi-language support
import { useTranslation } from "react-i18next";
// Import the OS context hook for opening applications
import { useOS } from "../../contexts/OSProvider";
// Import utility function to resolve asset paths
import { assetPath } from "../../utils/assetPath";
// Import component styling
import "./BossNotification.css";

/**
 * BossNotification Component
 * 
 * Displays a notification when a message from the security team arrives.
 * The notification automatically dismisses after 4.5 seconds if not clicked.
 * 
 * @param {boolean} visible - Controls whether the notification is displayed
 * @param {function} onDismiss - Callback function to hide the notification
 * 
 * @returns {JSX.Element} The notification component with an avatar and message preview
 */
export const BossNotification = ({ visible, onDismiss }) => {
  // Get the translation function for retrieving localized strings
  const { t } = useTranslation();
  // Get the function to open apps from the OS context
  const { openApp } = useOS();

  // Set up auto-dismiss timer when notification becomes visible
  useEffect(() => {
    // Exit early if notification is not visible
    if (!visible) return;
    // Schedule automatic dismissal after 4.5 seconds
    const timer = setTimeout(onDismiss, 4500);
    // Cleanup: clear the timer if component unmounts or dependencies change
    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  /**
   * Handle notification click event
   * Opens the messages app, closes any open drawer, and dismisses the notification
   */
  const handleClick = () => {
    // Open the messages application
    openApp("messages");
    // Dispatch custom event to close any open drawer
    window.dispatchEvent(new Event("closeDrawer"));
    // Dismiss the notification
    onDismiss();
  };

  // Render the notification UI
  return (
    // Notification container with conditional visibility styling
    <div 
      className={`boss-notification ${visible ? "boss-notification--visible" : ""}`} 
      onClick={handleClick}
    >
      {/* Security team avatar image */}
      <img
        className="boss-notification-avatar"
        src={assetPath("/assets/messages-icon.png")}
        alt="Security Team"
      />
      {/* Notification content container */}
      <div className="boss-notification-body">
        {/* Display the security team name */}
        <p className="boss-notification-name">{t("messagesApp.author.name")}</p>
        {/* Display the message notification text */}
        <p className="boss-notification-text">{t("messagesApp.newMessageNotification")}</p>
      </div>
    </div>
  );
};
