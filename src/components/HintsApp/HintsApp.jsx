import React, { useState, useMemo, useRef, useEffect } from "react";
import "./HintsApp.css";
// Import OS context for app management (open, close, minimize)
import { useOS } from "../../contexts/OSProvider";
// Import stats context to check player challenge completion progress
import { useStats } from "../../contexts/StatsProvider";
// Import translation hook for multi-language support
import { useTranslation } from "react-i18next";
// Import UI icons for the hints interface
import { FaTimes, FaMinus, FaLightbulb, FaChevronLeft, FaPlay } from "react-icons/fa";
// Import hints data in multiple languages (JSON format)
import hintsDataRaw from "./HintsData.json";
// Import xAPI tracking for learning analytics
import { useXAPI, XAPI_VERBS } from "../../contexts/XAPIProvider";
// Import utility function to resolve asset paths
import { assetPath } from "../../utils/assetPath";

/**
 * HintsApp Component - Escape Room Hints Application
 * 
 * Displays contextual hints and clues for the current puzzle based on player progress.
 * Features include:
 * - Dynamic hint display based on active challenge
 * - Multi-language support (English, Spanish)
 * - Intro video playback with language-specific content
 * - xAPI tracking for hint requests (learning analytics)
 * - Context-based hint organization
 * 
 * @returns {JSX.Element} The hints app window or intro video overlay
 */
export const HintsApp = () => {
  // Get app management functions from OS context
  const { closeApp, minimizeApp } = useOS();
  // Get challenge completion status to determine current puzzle
  const {
    challenge1Completed,
    challenge2Completed,
    challenge3Completed,
  } = useStats();
  // Get translation function and current language from i18n
  const { t, i18n } = useTranslation();

  // State for tracking which hint context is currently selected (null = list view)
  const [selectedContext, setSelectedContext] = useState(null);
  // State for showing intro videos (null = no video, 1 = intro video 1, 2 = intro video 2)
  const [showIntroVideo, setShowIntroVideo] = useState(null); // null | 1 | 2
  const hintsVideoRef = useRef(null);
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  // Try to play intro video — show tap-to-play if browser blocks autoplay
  useEffect(() => {
    if (showIntroVideo && hintsVideoRef.current) {
      setNeedsTapToPlay(false);
      const v = hintsVideoRef.current;
      v.load();
      v.play().catch(() => setNeedsTapToPlay(true));
    }
  }, [showIntroVideo]);

  /**
   * Determines the active puzzle ID based on player's challenge completion progress
   * Puzzle progression: 1 → 2 → 3 → 4 (completed all challenges)
   * Memoized to prevent recalculation on every render
   */
  const currentPuzzleId = useMemo(() => {
    if (!challenge1Completed) return "1";
    if (!challenge2Completed) return "2";
    if (!challenge3Completed) return "3";
    return "4";
  }, [challenge1Completed, challenge2Completed, challenge3Completed]);

  /**
   * Get current language code (first 2 characters) from i18n
   * Defaults to English if language not set
   */
  const lang = i18n.language?.slice(0, 2) || "en";
  /**
   * Get hints for the current language from JSON data
   * Falls back to English if current language not available
   */
  const langHints = hintsDataRaw[lang] ?? hintsDataRaw["en"] ?? {};
  /**
   * Get array of hints for the current puzzle
   * Empty array if puzzle has no hints
   */
  const currentHints = langHints[currentPuzzleId] ?? [];

  /**
   * Close the hints app
   */
  const handleClose = () => closeApp("hints");
  
  /**
   * Minimize the hints app
   */
  const handleMinimize = () => minimizeApp();

  // Get xAPI statement sending function for tracking hint requests
  const { sendStatement } = useXAPI();

  /**
   * Track hint request using xAPI for learning analytics
   * Records which hint was requested, for which puzzle, and which context
   * 
   * @param {string} puzzleId - The puzzle ID (1, 2, 3, or 4)
   * @param {number} hintIdx - Index of the hint in the current hints array
   * @param {string} hintTitle - The context/title of the hint
   */
  const trackHintAsked = async (puzzleId, hintIdx, hintTitle) => {
    // Send xAPI statement indicating a hint was requested
    await sendStatement(
      XAPI_VERBS.ASKED,
      {
        // Unique ID for this specific hint
        id: `https://endgameproject.github.io/xapi/escape-rooms/echo/objects/hint-${puzzleId}-${hintIdx + 1}`,
        definition: {
          // Human-readable name of the hint
          name: { en: `Hint: ${hintTitle}` },
          // Activity type indicator (tip/hint activity)
          type: "https://xapi.elearn.rwth-aachen.de/definitions/generic/activities/tip",
        },
      },
      null,
      {
        contextActivities: {
          // Parent activity: the puzzle this hint belongs to
          parent: [
            {
              id: `https://endgameproject.github.io/xapi/escape-rooms/echo/rooms/puzzle-${puzzleId}`,
              definition: { name: { en: `Puzzle ${puzzleId}` } },
            },
          ],
          // Grouping activity: the overall ECHO game
          grouping: [
            {
              id: "https://endgameproject.github.io/xapi/escape-rooms/echo",
              definition: { name: { en: "ECHO" } },
            },
          ],
        },
      }
    );
  };

  /**
   * Construct the intro video source URL based on current language and video number
   * Returns null if no intro video is being shown
   */
  const introVideoSrc = showIntroVideo
    ? assetPath(`/assets/intro${showIntroVideo}_${lang}.mp4`)
    : null;

  /**
   * Show intro video overlay when showIntroVideo state is not null
   * Handles sequential video playback (intro1 → intro2)
   */
  if (showIntroVideo) {
    return (
      // Full-screen overlay for video display
      <div className="hints-intro-overlay">
        {/* 
          Intro video player
          Plays automatically and supports inline playback on mobile
          Transitions between intro1 and intro2, then returns to app
        */}
        <video
          ref={hintsVideoRef}
          className="hints-intro-video"
          src={introVideoSrc}
          playsInline
          onEnded={() => {
            if (showIntroVideo === 1) {
              setShowIntroVideo(2);
            } else {
              setShowIntroVideo(null);
            }
          }}
          onError={() => setShowIntroVideo(null)}
        />
        {needsTapToPlay && (
          <button
            className="hints-tap-to-play"
            onClick={() => {
              setNeedsTapToPlay(false);
              hintsVideoRef.current?.play().catch(() => {});
            }}
          >
            ▶
          </button>
        )}
        <button
          className="hints-intro-skip"
          onClick={() => setShowIntroVideo(null)}
        >
          {t("hintsApp.skipVideo", "Skip")} →
        </button>
      </div>
    );
  }

  return (
    // Backdrop container - click to close the app
    <div className="hints-app-backdrop" onClick={handleClose}>
    {/* Main app window - stop propagation to prevent closing when clicking inside */}
    <div className="hints-app-window" onClick={(e) => e.stopPropagation()}>
      {/* Title bar with app name and window controls */}
      <div className="hints-titlebar">
        {/* Window title with icon and app name */}
        <div className="hints-window-title">
          <FaLightbulb className="hints-title-icon" />
          <span>{t("hintsApp.title")}</span>
        </div>
        {/* Window control buttons (minimize, close) */}
        <div className="hints-window-controls">
          {/* Minimize button */}
          <button
            className="window-control minimize"
            onClick={handleMinimize}
            title={t("desktop.window.minimize")}
            aria-label={t("desktop.window.minimize")}
          >
            <FaMinus />
          </button>
          {/* Close button */}
          <button
            className="window-control close"
            onClick={handleClose}
            title={t("desktop.window.close")}
            aria-label={t("desktop.window.close")}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Badge displaying current puzzle number and stage */}
      <div className="hints-puzzle-badge">
        {t(`hintsApp.puzzle.${currentPuzzleId}`)}
      </div>

      {/* Main content area with hints display */}
      <div className="hints-body">
        {/* 
          Conditional rendering based on app state:
          1. No hints available: Show empty state
          2. No context selected: Show list of contexts to choose from
          3. Context selected: Show detailed clue for selected context
        */}
        {currentHints.length === 0 ? (
          // Empty state - no hints available for current puzzle
          <div className="hints-empty">
            <FaLightbulb className="hints-empty-icon" />
            <p>{t("hintsApp.noHints")}</p>
          </div>
        ) : selectedContext === null ? (
          // Context list view - show all available hint contexts
          <>
            <p className="hints-prompt">{t("hintsApp.selectContext")}</p>
            {/* List of hint context buttons */}
            <ul className="hints-context-list">
              {currentHints.map((hint, idx) => (
                <li key={idx}>
                  <button
                    className="hints-context-btn"
                    onClick={() => {
                      // Track the hint request for learning analytics
                      trackHintAsked(currentPuzzleId, idx, hint.context);
                      // Show the selected hint
                      setSelectedContext(idx);
                    }}
                  >
                    <FaLightbulb className="hints-context-icon" />
                    <span>{hint.context}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          // Clue detail view - show the full clue for selected context
          <div className="hints-clue-view">
            {/* Back button to return to context list */}
            <button
              className="hints-back-btn"
              onClick={() => setSelectedContext(null)}
            >
              <FaChevronLeft />
              {t("hintsApp.back")}
            </button>
            {/* Display the context/category of the hint */}
            <div className="hints-clue-context">
              {currentHints[selectedContext].context}
            </div>
            {/* Display the actual clue text */}
            <div className="hints-clue-box">
              <FaLightbulb className="hints-clue-icon" />
              <p>{currentHints[selectedContext].clue}</p>
            </div>
          </div>
        )}

        {/* Rewatch intro video button */}
        <button
          className="hints-rewatch-btn"
          onClick={() => setShowIntroVideo(1)}
        >
          <FaPlay className="hints-rewatch-icon" />
          {t("hintsApp.rewatchIntro", "Rewatch intro video")}
        </button>
      </div>
    </div>
    </div>
  );
};
