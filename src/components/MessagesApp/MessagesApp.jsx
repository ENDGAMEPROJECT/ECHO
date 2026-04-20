import React, { useEffect, useMemo, useRef } from "react";
import "./MessagesApp.css";
// Import OS context for app management (close, minimize)
import { useOS } from "../../contexts/OSProvider";
// Import messages context for retrieving and managing messages
import { useMessages } from "../../contexts/MessagesProvider";
// Import UI icons for the messages app interface
import { FaTimes, FaMinus, FaComments } from "react-icons/fa";
// Import translation hook for multi-language support
import { useTranslation } from "react-i18next";

/**
 * MessagesApp Component - Messages Application
 * 
 * Displays a messaging interface for receiving messages/hints from the security team
 * Features include:
 * - Chat-style message display with chronological ordering
 * - Auto-scroll to latest messages
 * - Message read status tracking
 * - Locale-aware timestamp formatting
 * - Multi-language support
 * - Disabled message composer (UI only, no sending)
 * 
 * @returns {JSX.Element} The messages app window component
 */
export const MessagesApp = () => {
  // Get app management functions from OS context
  const { closeApp, minimizeApp } = useOS();
  // Get messages and markAsRead function from messages context
  const { messages, markAsRead } = useMessages();
  // Get translation function and current language from i18n
  const { t, i18n } = useTranslation();
  // Ref to the chat thread container for auto-scrolling
  const chatThreadRef = useRef(null);

  const getLocale = () => {
    // Map language codes to full locale strings
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      fi: "fi-FI",
      sr: "sr-RS",
    };
    return localeMap[i18n.language] || undefined;
  };

  /**
   * Sort messages chronologically (oldest first, newest at bottom - chat style)
   * Memoized to prevent unnecessary recalculation
   * If timestamps are identical, sort by message ID
   */
  const sortedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => {
          // Older messages first, newer at bottom (chat style)
          const timeDiff = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          if (timeDiff !== 0) return timeDiff;
          return a.id - b.id;
        }
      ),
    [messages]
  );

  /**
   * Effect to mark unread messages as read when component mounts or messages change
   * Automatically marks all unread messages as read when the app is opened
   */
  useEffect(() => {
    // Find all unread messages
    const unreadMessages = messages.filter((msg) => !msg.read);
    // Skip if no unread messages
    if (!unreadMessages.length) return;
    // Mark each unread message as read
    unreadMessages.forEach((msg) => markAsRead(msg.id));
  }, [messages, markAsRead]);

  /**
   * Effect to auto-scroll to the bottom of chat when new messages arrive
   * Scrolls smoothly with animation
   */
  useEffect(() => {
    // Skip if chat container ref is not available
    if (!chatThreadRef.current) return;
    // Scroll to bottom with smooth animation
    chatThreadRef.current.scrollTo({
      top: chatThreadRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [sortedMessages.length]);

  /**
   * Close the messages app
   */
  const handleClose = () => {
    closeApp("messages");
  };

  /**
   * Format timestamp to localized date and time string
   * Includes day, month, hour, and minute
   * 
   * @param {string} timestamp - ISO timestamp string
   * @returns {string} Formatted date/time string
   */
  const formatTime = (timestamp) => {
    // Parse timestamp to Date object
    const date = new Date(timestamp);
    // Format using locale-specific format
    return date.toLocaleString(getLocale(), {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    // Backdrop container - click to close the app
    <div className="messages-app-backdrop" onClick={handleClose}>
    {/* Main app window - stop propagation to prevent closing when clicking inside */}
    <div className="messages-app-window" onClick={(e) => e.stopPropagation()}>
      {/* Title bar with app name and window controls */}
      <div className="window-titlebar">
        {/* Window title with icon and app name */}
        <div className="window-title">
          <FaComments className="title-icon" />
          <span>{t("messagesApp.title")}</span>
        </div>
        {/* Window control buttons (minimize, close) */}
        <div className="window-controls">
          {/* Minimize button */}
          <button
            className="window-button minimize"
            onClick={minimizeApp}
            title={t("desktop.window.minimize")}
          >
            <FaMinus />
          </button>
          {/* Close button */}
          <button
            className="window-button close"
            onClick={handleClose}
            title={t("desktop.window.close")}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Main chat content area */}
      <div className="messages-chat-content">
        {/* Chat header with security team avatar and name */}
        <div className="messages-chat-header">
          {/* Security team avatar (circular badge with first letter) */}
          <div className="messages-chat-avatar security-avatar">
            <span>{t("messagesApp.author.name").charAt(0)}</span>
          </div>
          {/* Security team name and company/system info */}
          <div className="messages-chat-header-text">
            <h2>{t("messagesApp.author.name")}</h2>
            <span>ECHO</span>
          </div>
        </div>

        {/* Chat message thread - scrollable container for all messages */}
        <div ref={chatThreadRef} className="messages-chat-thread">
          {/* Map through sorted messages and render each as a chat bubble */}
          {sortedMessages.map((message) => (
            // Message row container (each message from security team)
            <article key={message.id} className="chat-message-row">
              {/* Security team avatar initial for each message */}
              <div className="chat-bubble-avatar">S</div>
              {/* Message bubble group (sender label + bubble) */}
              <div className="chat-bubble-group">
                {/* Sender name - translated from key */}
                <span className="chat-bubble-sender">{t(message.fromKey)}</span>
                {/* Message bubble container */}
                <div className="chat-bubble incoming">
                  {/* Message subject/topic */}
                  <p className="chat-bubble-subject">{t(message.subjectKey)}</p>
                  {/* Message body/content */}
                  <p className="chat-bubble-body">{t(message.contentKey)}</p>
                  {/* Message timestamp (locale-formatted) */}
                  <span className="chat-bubble-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Message composer area - disabled (UI only, for visual consistency) */}
        <div className="messages-chat-composer">
          {/* Read-only input field (disabled for user interactions) */}
          <input
            type="text"
            value={t("messagesApp.chatPlaceholder")}
            readOnly
            aria-label={t("messagesApp.chatPlaceholder")}
          />
          {/* Disabled send button (no sending functionality - view only) */}
          <button type="button" disabled>
            {t("messagesApp.send")}
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};
