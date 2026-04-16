import React from "react";
import "./Taskbar.css";
import { useOS } from "../../contexts/OSProvider";
import { useMessages } from "../../contexts/MessagesProvider";
import { FaComments, FaUsers, FaLightbulb, FaFolder } from "react-icons/fa";
import { useTranslation } from "react-i18next";

/**
 * Taskbar Component
 * 
 * Displays a Windows-style taskbar at the bottom of the desktop interface.
 * Features:
 * - Start button (Windows logo) on the left
 * - App buttons for Messages, Social, Files, and Hints apps
 * - Visual indicators for:
 *   - Open apps (highlighted)
 *   - Active/focused app (distinctly highlighted)
 *   - Unread message count badge on Messages app
 * - System clock showing current time in top-right
 * 
 * The taskbar allows users to:
 * - Click app buttons to focus/switch to that app
 * - See which apps are currently open
 * - See which app is actively being used
 * - Check unread message count at a glance
 * 
 * @component
 * @returns {JSX.Element} Windows-style taskbar with app buttons and system tray
 */
export const Taskbar = () => {
  // Get desktop OS context for app management (which apps are open, which is active)
  const { openApps, activeApp, focusApp } = useOS();
  
  // Get messaging context for unread message count
  const { unreadCount } = useMessages();
  
  // Get translation function for multilingual support
  const { t } = useTranslation();

  /**
   * Define taskbar apps configuration
   * Each app has:
   * - id: unique identifier for the app
   * - name: display name (localized from translation)
   * - icon: React component icon from react-icons
   * - badge: (optional) notification badge count (e.g., "3" for 3 unread messages)
   * 
   * Apps shown: Messages, Social, Files, Hints
   */
  const apps = [
    {
      id: "messages",
      name: t("desktop.apps.messages"),
      icon: <FaComments />,
      // Show unread message count as badge, or null if no unread messages
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: "social",
      name: t("desktop.apps.social"),
      icon: <FaUsers />,
    },
    {
      id: "files",
      name: t("desktop.apps.files"),
      icon: <FaFolder />,
    },
    {
      id: "hints",
      name: t("hintsApp.title"),
      icon: <FaLightbulb />,
    },
  ];

  return (
    // TASKBAR CONTAINER - Main taskbar element
    <div className="taskbar">
      {/* CENTER SECTION - Application buttons */}
      <div className="taskbar-apps-container">
        <div className="taskbar-apps">
          {/* Map through apps array and create a button for each */}
          {apps.map((app) => (
            <button
              key={app.id}
              // Conditional classes:
              // - "open": app is in openApps list
              // - "active": app is the currently focused/active app
              className={`taskbar-app-button ${
                openApps.includes(app.id) ? "open" : ""
              } ${activeApp === app.id ? "active" : ""}`}
              // Click to focus/switch to this app
              onClick={() => focusApp(app.id)}
              // Tooltip shows full app name on hover
              title={app.name}
            >
              {/* App icon */}
              <span className="app-icon">{app.icon}</span>
              
              {/* App name label */}
              <span className="app-name">{app.name}</span>
              
              {/* Notification badge (e.g., unread message count) - only shown if badge exists */}
              {app.badge && <span className="app-badge">{app.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT SECTION - System tray with clock */}
      <div className="taskbar-tray">
        {/* System clock showing current time */}
        <div className="taskbar-clock">
          {/* Format: HH:MM in Spanish locale (es-ES) */}
          {new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
