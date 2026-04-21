import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Desktop.css";
import { MessagesApp } from "../../components/MessagesApp/MessagesApp";
import { SocialMediaApp } from "../../components/SocialMediaApp/SocialMediaApp";
import { HintsApp } from "../../components/HintsApp/HintsApp";
import { FilesApp } from "../../components/FilesApp/FilesApp";
import { PopupNotification } from "../../components/PopupNotification/PopupNotification";
import { BossNotification } from "../../components/BossNotification/BossNotification";
import { SurveyModal } from "../../components/SurveyModal/SurveyModal";
import { useOS } from "../../contexts/OSProvider";
import { useMessages } from "../../contexts/MessagesProvider";
import { useStats } from "../../contexts/StatsProvider";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "../../contexts/XAPIProvider";
import { FaChevronUp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { assetPath } from "../../utils/assetPath";

const SUCCESS_OUTRO_DELAY_MS = 10000;
const FAIL_OUTRO_DELAY_MS = 7000;
const OUTRO_COMPLETED_KEY = "echo:outroCompleted";

/**
 * Desktop: Main OS simulation desktop screen
 * Manages simulated desktop environment with clock, apps, drawer, notifications, and outro video flow
 * Handles escape room timer, challenge completion, survey, and session restart
 */
export const Desktop = () => {
  // OS management: track which app is open
  const { activeApp, openApp, minimizeApp } = useOS();
  // Messages: track unread message count for badge
  const { unreadCount } = useMessages();
  // Game state: challenges, timer, completion status
  const {
    challengeFinalCompleted, // Challenge 4 (community note) complete
    escapeTimerStarted, // Escape room timer active
    escapeTimerRemainingMs, // Milliseconds remaining
    escapeTimerFlashTick, // Flash signal for countdown
    escapeTimerExpired, // Timer ran out
    finalCompletionStatus, // "success" or "fail"
    finalCompletionAt, // Timestamp when completed
  } = useStats();
  // xAPI tracking: send learning statements to LRS
  const { sendStatement } = useXAPI();
  // Multi-language support
  const { t, i18n } = useTranslation();
  // Check if mission brief read (blocks social app access)
  const missionBriefRead = sessionStorage.getItem("missionBriefRead") === "true";
  
  // Popup state: info popup when trying to access locked app
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    position: { top: 0, left: 0 },
  });
  // Map i18n language codes to Intl locale strings
  const locale = useMemo(() => {
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      fi: "fi-FI",
      sr: "sr-RS",
    };
    return localeMap[i18n.language] || undefined;
  }, [i18n.language]);
  // Drawer configuration (not currently used but kept for future)
  const drawerConfig = useMemo(
    () => ({
      height: 120,
      handleHeight: 36,
    }),
    []
  );
  // Drawer closed position offset
  const closedTranslate = 90;
  // Drawer state: track open/closed and translate value
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTranslate, setDrawerTranslate] = useState(0);
  // Current time for clock display (updates every second)
  const [now, setNow] = useState(() => new Date());
  // Boss notification visibility
  const [bossNotifVisible, setBossNotifVisible] = useState(false);
  // Countdown timer flash animation state
  const [countdownFlash, setCountdownFlash] = useState(false);
  // Survey modal visibility
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  // End options modal (restart/continue/visit resources)
  const [showEndOptionsModal, setShowEndOptionsModal] = useState(false);
  // Track if survey already submitted in this session
  const [surveyCompleted, setSurveyCompleted] = useState(() => {
    return sessionStorage.getItem('surveyCompleted') === 'true';
  });
  // Track if outro video already played
  const [outroCompleted, setOutroCompleted] = useState(() => {
    return sessionStorage.getItem(OUTRO_COMPLETED_KEY) === "true";
  });
  // Show outro video overlay
  const [showOutroVideo, setShowOutroVideo] = useState(false);
  // Selected language for outro video (localized version)
  const [outroLanguage, setOutroLanguage] = useState(() => {
    const baseLanguage = i18n.resolvedLanguage || i18n.language || "es";
    return ["es", "en", "fi", "sr"].includes(baseLanguage) ? baseLanguage : "es";
  });
  // Track last flash tick to trigger countdown animation once
  const lastHandledFlashTickRef = useRef(escapeTimerFlashTick);
  // Timeout for delayed outro video display
  const outroTimeoutRef = useRef(null);
  // Reference to video element for auto-play control
  const outroVideoRef = useRef(null);
  // Countdown is critical (red flashing) when <= 5 minutes remain
  const isCountdownCritical = escapeTimerRemainingMs <= 5 * 60 * 1000;
  // Handler: dismiss boss notification
  const handleBossNotifDismiss = useCallback(() => setBossNotifVisible(false), []);
  // Normalize i18n language to supported outro video languages
  const normalizedLanguage = useMemo(() => {
    const baseLanguage = i18n.resolvedLanguage || i18n.language || "es";
    return ["es", "en", "fi", "sr"].includes(baseLanguage) ? baseLanguage : "es";
  }, [i18n.language, i18n.resolvedLanguage]);
  // Determine outro video src based on completion status (success/fail) and language
  const outroVideoSrc = useMemo(() => {
    if (!finalCompletionStatus) return null;
    const suffix = finalCompletionStatus === "success" ? "success" : "fail";
    return assetPath(`/assets/outro_${suffix}_${outroLanguage}.mp4`);
  }, [finalCompletionStatus, outroLanguage]);
  // Check if outro video should be played (challenge done, not yet shown)
  const isOutroPending =
    challengeFinalCompleted && !outroCompleted && !showOutroVideo && Boolean(finalCompletionStatus);
  // Check if survey should be available (game complete or timed out, survey not done)
  const isSurveyAvailable =
    !surveyCompleted &&
    !showOutroVideo &&
    !isOutroPending &&
    (escapeTimerExpired || (challengeFinalCompleted && outroCompleted && finalCompletionStatus !== "success"));
  // Track if entire flow (challenge + outro) is complete
  const isEndingFlowComplete = challengeFinalCompleted && outroCompleted;

  // Timeout for survey banner auto-reopen (30 seconds)
  const surveyReopenTimerRef = useRef(null);
  // Track if survey banner dismissed by user
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Handler: dismiss survey banner and reshow after 30 seconds
  const handleDismissBanner = () => {
    setBannerDismissed(true);
    surveyReopenTimerRef.current = setTimeout(() => {
      setBannerDismissed(false);
    }, 30000);
  };

  // Handler: open survey modal and clear auto-reopen timer
  const handleOpenSurvey = () => {
    if (surveyReopenTimerRef.current) {
      clearTimeout(surveyReopenTimerRef.current);
      surveyReopenTimerRef.current = null;
    }
    setShowSurveyModal(true);
  };

  // Handler: close survey modal and reshow after 30 seconds if not completed
  const handleCloseSurvey = () => {
    setShowSurveyModal(false);
    if (!surveyCompleted) {
      surveyReopenTimerRef.current = setTimeout(() => {
        setShowSurveyModal(true);
      }, 30000);
    }
  };

  // Handler: close end options modal
  const handleCloseEndOptionsModal = () => setShowEndOptionsModal(false);

  // Handler: restart game - clear all state and reload page
  const handleRestartSession = useCallback(async () => {
    setShowEndOptionsModal(false);
    await new Promise((resolve) => setTimeout(resolve, 150));
    sessionStorage.clear(); // Clear all game state
    window.location.reload(); // Reload page
  }, []);

  // Handler: open ENDGAME project page in new tab
  const handleVisitEndgame = useCallback(() => {
    setShowEndOptionsModal(false);
    window.open("https://endgameproject.github.io/", "_blank", "noopener,noreferrer");
  }, []);

  // Handler: submit survey answers and send xAPI EVALUATED event
  const handleSurveySubmit = async (answers) => {
    console.log('Survey answers:', answers);
    // Mark survey as completed
    sessionStorage.setItem('surveyCompleted', 'true');
    sessionStorage.setItem('gameCompletedAt', String(Date.now()));
    setSurveyCompleted(true);
    setShowSurveyModal(false);

    // Send survey results xAPI statement to learning record store
    await sendStatement(
      XAPI_VERBS.EVALUATED,
      ECHO_ACTIVITIES.SURVEY,
      {
        response: JSON.stringify(answers),
        extensions: {
          "https://endgameproject.github.io/xapi/ext/surveyAnswers": answers,
        },
      }
    );
    // Show end options modal when survey complete
    setShowEndOptionsModal(true);
  };

  // Handler: outro video finished - show survey or end options
  const handleOutroFinished = useCallback(async () => {
    if (outroTimeoutRef.current) {
      clearTimeout(outroTimeoutRef.current);
      outroTimeoutRef.current = null;
    }
    // Mark outro as completed
    sessionStorage.setItem(OUTRO_COMPLETED_KEY, "true");
    setShowOutroVideo(false);
    setOutroCompleted(true);
    // Show survey if not yet completed, otherwise show end options
    if (!surveyCompleted) {
      setShowSurveyModal(true);
      return;
    }
    setShowEndOptionsModal(true);
  }, [surveyCompleted]);

  // Handler: outro video playback error - fallback to handleOutroFinished
  const handleOutroVideoError = useCallback(() => {
    handleOutroFinished();
  }, [handleOutroFinished]);

  // Helper: clamp drawer translate value between 0 and closedTranslate
  const clampTranslate = (value) =>
    Math.min(Math.max(value, 0), closedTranslate);

  // Helper: sync drawer open/closed state with translate value
  const syncDrawer = (open) => {
    setDrawerOpen(open);
    setDrawerTranslate(open ? 0 : closedTranslate);
  };

  // Handler: toggle drawer open/closed
  const handleToggleDrawer = () => {
    syncDrawer(!drawerOpen);
  };

  // Handler: open messages app
  const handleOpenMessages = () => {
    openApp("messages");
    syncDrawer(false);
  };

  // Handler: open social media app (check mission brief lock first)
  const handleOpenSocial = (e) => {
    if (!missionBriefRead) {
      // Mission brief not read - show locked popup above button
      const rect = e.currentTarget.getBoundingClientRect();
      const popupWidth = 280;
      setPopup({
        visible: true,
        message: t("desktop.popup.readMessage"),
        position: {
          top: rect.top - 70,
          left: rect.left + rect.width / 2 - popupWidth / 2,
        },
      });
      return;
    }
    // Mission brief read - unlock social app
    openApp("social");
    syncDrawer(false);
  };

  // Handler: open hints app
  const handleOpenTips = () => {
    openApp("hints");
    syncDrawer(false);
  };

  // Handler: open files app
  const handleOpenFiles = () => {
    openApp("files");
    syncDrawer(false);
  };

  // Handler: close info popup
  const handleClosePopup = () => {
    setPopup({ ...popup, visible: false });
  };

  // Effect: set up global event listeners for drawer and boss notifications
  useEffect(() => {
    const handleCloseDrawer = () => syncDrawer(false);
    const handleOpenDrawer = () => syncDrawer(true);
    const handleBossMessage = () => setBossNotifVisible(true);
    // Listen for custom events from other components
    window.addEventListener("closeDrawer", handleCloseDrawer);
    window.addEventListener("openDrawer", handleOpenDrawer);
    window.addEventListener("bossMessage", handleBossMessage);
    return () => {
      // Clean up listeners and timers on unmount
      window.removeEventListener("closeDrawer", handleCloseDrawer);
      window.removeEventListener("openDrawer", handleOpenDrawer);
      window.removeEventListener("bossMessage", handleBossMessage);
      if (surveyReopenTimerRef.current) clearTimeout(surveyReopenTimerRef.current);
    };
  }, []);

  // Effect: update clock every second
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Effect: trigger countdown timer flash animation when tick changes
  useEffect(() => {
    if (!escapeTimerStarted || challengeFinalCompleted || !escapeTimerFlashTick) return;
    if (escapeTimerFlashTick <= lastHandledFlashTickRef.current) return;
    // Track this tick to avoid duplicate animation
    lastHandledFlashTickRef.current = escapeTimerFlashTick;
    setCountdownFlash(true);
    // Duration longer for critical (red) state
    const timeoutId = setTimeout(() => setCountdownFlash(false), isCountdownCritical ? 1700 : 1300);
    return () => clearTimeout(timeoutId);
  }, [escapeTimerFlashTick, escapeTimerStarted, challengeFinalCompleted, isCountdownCritical]);

  // Effect: show outro video after delay when challenge completes
  useEffect(() => {
    if (!challengeFinalCompleted || !finalCompletionStatus || outroCompleted) return;

    // Set outro language and hide survey
    setOutroLanguage(normalizedLanguage);
    setShowSurveyModal(false);
    // Calculate delay: if already elapsed, show immediately
    const elapsedSinceCompletion = finalCompletionAt ? Date.now() - finalCompletionAt : 0;
    const targetDelay = finalCompletionStatus === "success"
      ? SUCCESS_OUTRO_DELAY_MS
      : FAIL_OUTRO_DELAY_MS;
    const remainingDelay = Math.max(0, targetDelay - elapsedSinceCompletion);

    // Schedule outro video display
    outroTimeoutRef.current = setTimeout(() => {
      setShowOutroVideo(true);
    }, remainingDelay);

    return () => {
      if (outroTimeoutRef.current) {
        clearTimeout(outroTimeoutRef.current);
        outroTimeoutRef.current = null;
      }
    };
  }, [challengeFinalCompleted, finalCompletionAt, finalCompletionStatus, normalizedLanguage, outroCompleted]);

  // Effect: auto-play outro video when displayed
  useEffect(() => {
    if (!showOutroVideo || !outroVideoRef.current) return;
    const playPromise = outroVideoRef.current.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {}); // Suppress autoplay errors
    }
  }, [showOutroVideo, outroVideoSrc]);

  // Memoized: format remaining time as MM:SS string
  const countdownText = useMemo(() => {
    const totalSeconds = Math.max(0, Math.ceil(escapeTimerRemainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [escapeTimerRemainingMs]);

  // Memoized: format current date for clock display
  const formattedDate = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  // Memoized: format current time for clock display
  const formattedTime = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="desktop-container">
      {/* Desktop shell: background with clock and countdown timer */}
      <div className="desktop-shell">
        <div className="desktop-glow" />
        {/* Digital clock display: shows current date and time */}
        <div className="desktop-clock">
          <span className="desktop-clock-time">{formattedTime}</span>
          <span className="desktop-clock-date">{formattedDate}</span>
        </div>
        {/* Escape room countdown timer: shows only when timer active and not challenge complete */}
        {escapeTimerStarted && !challengeFinalCompleted && activeApp !== "social" && (
          <div
            className={`desktop-countdown ${isCountdownCritical ? "desktop-countdown--critical" : ""} ${countdownFlash ? "desktop-countdown--flash" : ""}`}
          >
            <span className="desktop-countdown-label">{t("shared.timeLeft")}</span>
            <span className="desktop-countdown-value">{countdownText}</span>
          </div>
        )}
      </div>

      {/* Messages app overlay: click background to minimize */}
      {activeApp === "messages" && (
        <div className="app-overlay" onClick={minimizeApp}>
          <div
            className="app-overlay-content"
            onClick={(event) => event.stopPropagation()}
          >
            <MessagesApp />
          </div>
        </div>
      )}

      {/* Social media app overlay: challenges and community notes */}
      {activeApp === "social" && (
        <div className="app-overlay" onClick={minimizeApp}>
          <div
            className="app-overlay-content"
            onClick={(event) => event.stopPropagation()}
          >
            <SocialMediaApp />
          </div>
        </div>
      )}

      {/* Hints app overlay: tips and hints for challenges */}
      {activeApp === "hints" && (
        <div className="app-overlay" onClick={minimizeApp}>
          <div
            className="app-overlay-content"
            onClick={(event) => event.stopPropagation()}
          >
            <HintsApp />
          </div>
        </div>
      )}

      {/* Files app overlay: document viewer */}
      {activeApp === "files" && (
        <div className="app-overlay" onClick={minimizeApp}>
          <div
            className="app-overlay-content"
            onClick={(event) => event.stopPropagation()}
          >
            <FilesApp />
          </div>
        </div>
      )}

      {/* App launcher drawer: shows 4 main app icons at bottom */}
      <div
        className={`app-drawer open ${unreadCount > 0 ? "has-unread" : ""}`}
     
      >
        {/* Drawer toggle button - currently disabled */}
        {/* <button
          className="app-drawer-handle"
          onClick={handleToggleDrawer}
          aria-label={drawerOpen ? "Cerrar drawer" : "Abrir drawer"}
          title={drawerOpen ? "Cerrar" : "Abrir"}
        >
          <FaChevronUp className={drawerOpen ? "arrow open" : "arrow"} />
        </button> */}

        {/* Drawer content: app launcher buttons */}
        <div className="app-drawer-content">
          {/* Messages app launcher: shows unread badge */}
          <button
            className="app-launcher-card"
            onClick={handleOpenMessages}
            title={t("desktop.apps.messages")}
          >
            <img
              className="launcher-image launcher-image--messages"
              src={assetPath("/assets/messages-icon.png")}
              alt={t("desktop.apps.messages")}
            />
            <span className="launcher-label">
              {t("desktop.apps.messages")}
            </span>
            {unreadCount > 0 && (
              <span className="launcher-badge">{unreadCount}</span>
            )}
          </button>
          {/* Social media app launcher: locked until mission brief read */}
          <button
            className={`app-launcher-card ${!missionBriefRead ? "is-locked" : ""}`}
            onClick={handleOpenSocial}
            title={t("desktop.apps.social")}
          >
            <img
              className="launcher-image launcher-image--echo" 
              src={assetPath("/assets/echo-logo-short.png")}
              alt={t("desktop.apps.social")}
            />
            <span className="launcher-label">
              {t("desktop.apps.social")}
            </span>
          </button>
          {/* Files app launcher: document explorer */}
          <button
            className="app-launcher-card"
            type="button"
            onClick={handleOpenFiles}
            title={t("desktop.apps.files")}
          >
            <img
              className="launcher-image launcher-image--files"
              src={assetPath("/assets/folder.png")}
              alt={t("desktop.apps.files")}
            />
            <span className="launcher-label">{t("desktop.apps.files")}</span>
          </button>
          {/* Hints app launcher: tips panel */}
          <button
            className="app-launcher-card"
            onClick={handleOpenTips}
            title={t("desktop.apps.hints")}
          >
            <img
              className="launcher-image"
              src={assetPath("/assets/tips-icon.png")}
              alt={t("desktop.apps.hints")}
            />
            <span className="launcher-label">{t("desktop.apps.hints")}</span>
          </button>
        </div>
      </div>

      {/* Info popup: shows when app is locked */}
      {popup.visible && (
        <PopupNotification
          message={popup.message}
          position={popup.position}
          onClose={handleClosePopup}
        />
      )}

      {/* Boss notification: appears when new boss message arrives */}
      <BossNotification
        visible={bossNotifVisible}
        onDismiss={handleBossNotifDismiss}
      />

      {/* Survey banner: shows when game complete and survey not done (with 30s dismiss timer) */}
      {isSurveyAvailable && !bannerDismissed && (
        <div className="survey-banner" onClick={handleOpenSurvey}>
          <span className="survey-banner-icon">🎉</span>
          <div className="survey-banner-content">
            <span className="survey-banner-title">{t('survey.bannerTitle', 'Thanks for playing!')}</span>
            <span className="survey-banner-subtitle">{t('survey.bannerSubtitle', 'Give us your feedback')}</span>
          </div>
          <button className="survey-banner-btn">
            {t('survey.bannerButton', 'Take Survey')}
          </button>
          {/* Close button: dismiss banner for 30 seconds */}
          <button
            className="survey-banner-close"
            onClick={(e) => {
              e.stopPropagation();
              handleDismissBanner();
            }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Survey modal overlay */}
      {showSurveyModal && (
        <SurveyModal
          onClose={handleCloseSurvey}
          onSubmit={handleSurveySubmit}
        />
      )}

      {/* End options modal: shows after survey (or outro if failed) */}
      {showEndOptionsModal && (
        <div className="end-options-overlay" onClick={handleCloseEndOptionsModal}>
          <div className="end-options-modal" onClick={(event) => event.stopPropagation()}>
            <h2 className="end-options-title">
              {t("escapeRoomEnd.title", "Escape room finished")}
            </h2>
            <p className="end-options-description">
              {t(
                "escapeRoomEnd.description",
                "What would you like to do next?",
              )}
            </p>
            <div className="end-options-actions">
              {/* Restart session button: clear all state and reload */}
              <button
                type="button"
                className="end-options-btn end-options-btn--primary"
                onClick={handleRestartSession}
              >
                {t("escapeRoomEnd.restart", "Return to the beginning")}
              </button>
              {/* Continue exploring button: close modal and keep exploring */}
              <button
                type="button"
                className="end-options-btn"
                onClick={handleCloseEndOptionsModal}
              >
                {t("escapeRoomEnd.continueExploring", "Continue exploring ECHO")}
              </button>
              {/* Visit ENDGAME resources button: open external link */}
              <button
                type="button"
                className="end-options-btn"
                onClick={handleVisitEndgame}
              >
                {t("escapeRoomEnd.visitResources", "Visit ENDGAME resources")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Outro video overlay: plays success/fail video at game completion */}
      {showOutroVideo && outroVideoSrc && (
        <div className="outro-video-overlay">
          <video
            ref={outroVideoRef}
            className="outro-video-player"
            src={outroVideoSrc}
            autoPlay
            playsInline
            onEnded={handleOutroFinished}
            onError={handleOutroVideoError}
            onContextMenu={(event) => event.preventDefault()}
          />
        </div>
      )}
    </div>
  );
};
