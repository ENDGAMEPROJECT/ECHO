import React, { createContext, useContext, useState, useRef } from "react";

/**
 * OSContext
 * 
 * React Context for managing the simulated "Operating System" state.
 * This context controls:
 * - Which applications are currently open
 * - Which application has focus/is active
 * - Minimizing and closing applications
 * - Switching between open applications
 * 
 * This creates a desktop-like experience within the web application,
 * allowing users to multitask between different apps (Social Media, Messages, Files, Hints).
 */
const OSContext = createContext();

/**
 * useOS Hook
 * 
 * Custom hook to access the OS context from any component.
 * 
 * Returns context object with:
 * - openApps: Array of app IDs that are currently open
 * - activeApp: ID of the currently focused app (null if minimized to desktop)
 * - openApp(appId): Function to open an app and set it as active
 * - closeApp(appId): Function to close an app and restore focus to previous app
 * - minimizeApp(): Function to minimize the active app (return to desktop)
 * - focusApp(appId): Function to switch focus to an app (open if needed)
 * 
 * Usage:
 *   const { openApps, activeApp, openApp } = useOS();
 * 
 * Throws error if used in a component not wrapped by OSProvider.
 * 
 * @returns {Object} OS context containing state and functions
 * @throws {Error} If context not found (component not within OSProvider)
 */
export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error("useOS must be used within OSProvider");
  }
  return context;
};

export const OSProvider = ({ children }) => {
  // Track all currently open applications (e.g., 'social', 'messages', 'files', 'hints')
  const [openApps, setOpenApps] = useState([]);
  
  // Track which application is currently focused/active
  // null = desktop (minimized state)
  const [activeApp, setActiveApp] = useState(null);
  
  // Remember the previously active app for intelligent focus restoration
  // Used when closing the current app to restore focus to the app that was active before
  const previousActiveAppRef = useRef(null);

  /**
   * Open an application and set it as the active/focused app
   * 
   * Behavior:
   * 1. If app is not already open, add it to openApps array
   * 2. Remember the current active app (for later restoration if this app closes)
   * 3. Set the specified app as the active/focused app
   * 
   * This brings the app window to the foreground in the UI.
   * If app is already open, just switch focus to it.
   * 
   * @param {string} appId - ID of the application to open (e.g., 'social', 'messages', 'files', 'hints')
   */
  const openApp = (appId) => {
    // Only add to openApps if not already open
    if (!openApps.includes(appId)) {
      setOpenApps([...openApps, appId]);
    }
    // Remember current active app before switching
    previousActiveAppRef.current = activeApp;
    // Set the app as active/focused
    setActiveApp(appId);
  };

  /**
   * Close an application and restore focus to the previous active app
   * 
   * Behavior:
   * 1. Remove the app from openApps array
   * 2. If closed app was active, restore focus:
   *    - First try to restore to previousActiveAppRef (the app active before this one)
   *    - If that app is not open, switch to the last open app
   *    - If no apps remain, set activeApp to null (show desktop)
   * 3. If closed app was not active, no focus change needed
   * 
   * This mimics desktop OS behavior where closing a window restores focus
   * to the previously active window.
   * 
   * @param {string} appId - ID of the application to close
   */
  const closeApp = (appId) => {
    // Remove app from open apps list
    const remaining = openApps.filter((id) => id !== appId);
    setOpenApps(remaining);
    
    // If closing the currently active app, restore focus
    if (activeApp === appId) {
      // Try to restore to the previous active app
      const prev = previousActiveAppRef.current;
      const target = remaining.includes(prev)
        ? prev                              // Restore to previous app if still open
        : remaining.length > 0 ? remaining[remaining.length - 1]  // Or focus the last open app
        : null;                             // Or minimize to desktop if no apps remain
      setActiveApp(target);
    }
  };

  /**
   * Minimize the currently active application (return to desktop)
   * 
   * Behavior:
   * 1. Sets activeApp to null (shows desktop)
   * 2. Does NOT close the app, just hides its window
   * 3. The app remains in openApps and can be restored by clicking it in Taskbar
   * 
   * This mimics minimizing a window to the taskbar in a traditional OS.
   */
  const minimizeApp = () => {
    // Unset the active app (show desktop)
    setActiveApp(null);
  };

  /**
   * Switch focus to a specific application
   * 
   * Behavior:
   * 1. If app is already open, just switch focus to it (setActiveApp)
   * 2. If app is not open, open it first then set as active
   * 
   * This allows clicking a Taskbar icon to either restore a minimized app
   * or open a new instance.
   * 
   * @param {string} appId - ID of the application to focus
   */
  const focusApp = (appId) => {
    if (openApps.includes(appId)) {
      // App already open, just switch focus to it
      setActiveApp(appId);
    } else {
      // App not open, open it (which sets it as active)
      openApp(appId);
    }
  };

  // Context value: all state and functions available to consuming components
  const value = {
    openApps,     // Array of app IDs currently open
    activeApp,    // ID of currently focused app (null if minimized)
    openApp,      // Function to open and focus an app
    closeApp,     // Function to close an app
    minimizeApp,  // Function to minimize active app
    focusApp,     // Function to focus/restore an app
  };

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};
