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
 * Componente Desktop - Pantalla principal del sistema operativo simulado
 * Muestra el fondo de escritorio y las aplicaciones abiertas
 */
export const Desktop = () => {
  const { activeApp, openApp, minimizeApp } = useOS();
  const { unreadCount } = useMessages();
  const {
    challengeFinalCompleted,
    escapeTimerStarted,
    escapeTimerRemainingMs,
    escapeTimerFlashTick,
    escapeTimerExpired,
    finalCompletionStatus,
    finalCompletionAt,
  } = useStats();
  const { sendStatement } = useXAPI();
  const { t, i18n } = useTranslation();
  const missionBriefRead = sessionStorage.getItem("missionBriefRead") === "true";
  
  // Estado para el popup
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    position: { top: 0, left: 0 },
  });
  const locale = useMemo(() => {
    const localeMap = {
      es: "es-ES",
      en: "en-US",
      fi: "fi-FI",
      sr: "sr-RS",
    };
    return localeMap[i18n.language] || undefined;
  }, [i18n.language]);
  const drawerConfig = useMemo(
    () => ({
      height: 120,
      handleHeight: 36,
    }),
    []
  );
  const closedTranslate = 90;
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [drawerTranslate, setDrawerTranslate] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [bossNotifVisible, setBossNotifVisible] = useState(false);
  const [countdownFlash, setCountdownFlash] = useState(false);
  const [showSurveyModal, setShowSurveyModal] = useState(false);
  const [showEndOptionsModal, setShowEndOptionsModal] = useState(false);
  const [surveyCompleted, setSurveyCompleted] = useState(() => {
    return sessionStorage.getItem('surveyCompleted') === 'true';
  });
  const [outroCompleted, setOutroCompleted] = useState(() => {
    return sessionStorage.getItem(OUTRO_COMPLETED_KEY) === "true";
  });
  const [showOutroVideo, setShowOutroVideo] = useState(false);
  const [outroLanguage, setOutroLanguage] = useState(() => {
    const baseLanguage = i18n.resolvedLanguage || i18n.language || "es";
    return ["es", "en", "fi", "sr"].includes(baseLanguage) ? baseLanguage : "es";
  });
  const lastHandledFlashTickRef = useRef(escapeTimerFlashTick);
  const outroTimeoutRef = useRef(null);
  const outroVideoRef = useRef(null);
  const isCountdownCritical = escapeTimerRemainingMs <= 5 * 60 * 1000;
  const handleBossNotifDismiss = useCallback(() => setBossNotifVisible(false), []);
  const normalizedLanguage = useMemo(() => {
    const baseLanguage = i18n.resolvedLanguage || i18n.language || "es";
    return ["es", "en", "fi", "sr"].includes(baseLanguage) ? baseLanguage : "es";
  }, [i18n.language, i18n.resolvedLanguage]);
  const outroVideoSrc = useMemo(() => {
    if (!finalCompletionStatus) return null;
    const suffix = finalCompletionStatus === "success" ? "success" : "fail";
    return assetPath(`/assets/Outro_${suffix}_${outroLanguage}.mp4`);
  }, [finalCompletionStatus, outroLanguage]);
  const isOutroPending =
    challengeFinalCompleted && !outroCompleted && !showOutroVideo && Boolean(finalCompletionStatus);
  const isSurveyAvailable =
    !surveyCompleted &&
    !showOutroVideo &&
    !isOutroPending &&
    (escapeTimerExpired || (challengeFinalCompleted && outroCompleted && finalCompletionStatus !== "success"));
  const isEndingFlowComplete = challengeFinalCompleted && outroCompleted;

  const surveyReopenTimerRef = useRef(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    surveyReopenTimerRef.current = setTimeout(() => {
      setBannerDismissed(false);
    }, 30000);
  };

  const handleOpenSurvey = () => {
    if (surveyReopenTimerRef.current) {
      clearTimeout(surveyReopenTimerRef.current);
      surveyReopenTimerRef.current = null;
    }
    setShowSurveyModal(true);
  };

  const handleCloseSurvey = () => {
    setShowSurveyModal(false);
    if (!surveyCompleted) {
      surveyReopenTimerRef.current = setTimeout(() => {
        setShowSurveyModal(true);
      }, 30000);
    }
  };

  const handleCloseEndOptionsModal = () => setShowEndOptionsModal(false);

  const handleRestartSession = useCallback(async () => {
    setShowEndOptionsModal(false);
    await new Promise((resolve) => setTimeout(resolve, 150));
    sessionStorage.clear();
    window.location.reload();
  }, []);

  const handleVisitEndgame = useCallback(() => {
    setShowEndOptionsModal(false);
    window.open("https://endgameproject.github.io/", "_blank", "noopener,noreferrer");
  }, []);

  
  const handleSurveySubmit = async (answers) => {
    console.log('Survey answers:', answers);
    sessionStorage.setItem('surveyCompleted', 'true');
    sessionStorage.setItem('gameCompletedAt', String(Date.now()));
    setSurveyCompleted(true);
    setShowSurveyModal(false);

    // Send survey results to LRS
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
    setShowEndOptionsModal(true);
  };

  const handleOutroFinished = useCallback(async () => {
    if (outroTimeoutRef.current) {
      clearTimeout(outroTimeoutRef.current);
      outroTimeoutRef.current = null;
    }
    sessionStorage.setItem(OUTRO_COMPLETED_KEY, "true");
    setShowOutroVideo(false);
    setOutroCompleted(true);
    if (!surveyCompleted) {
      setShowSurveyModal(true);
      return;
    }
    setShowEndOptionsModal(true);
  }, [surveyCompleted]);

  const handleOutroVideoError = useCallback(() => {
    handleOutroFinished();
  }, [handleOutroFinished]);

  const clampTranslate = (value) =>
    Math.min(Math.max(value, 0), closedTranslate);

  const syncDrawer = (open) => {
    setDrawerOpen(open);
    setDrawerTranslate(open ? 0 : closedTranslate);
  };

  const handleToggleDrawer = () => {
    syncDrawer(!drawerOpen);
  };

  const handleOpenMessages = () => {
    openApp("messages");
    syncDrawer(false);
  };

  const handleOpenSocial = (e) => {
    if (!missionBriefRead) {
      // Mostrar popup: posición arriba del botón y centrado horizontalmente
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
    openApp("social");
    syncDrawer(false);
  };

  const handleOpenTips = () => {
    openApp("hints");
    syncDrawer(false);
  };

  const handleOpenFiles = () => {
    openApp("files");
    syncDrawer(false);
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, visible: false });
  };

  useEffect(() => {
    const handleCloseDrawer = () => syncDrawer(false);
    const handleOpenDrawer = () => syncDrawer(true);
    const handleBossMessage = () => setBossNotifVisible(true);
    window.addEventListener("closeDrawer", handleCloseDrawer);
    window.addEventListener("openDrawer", handleOpenDrawer);
    window.addEventListener("bossMessage", handleBossMessage);
    return () => {
      window.removeEventListener("closeDrawer", handleCloseDrawer);
      window.removeEventListener("openDrawer", handleOpenDrawer);
      window.removeEventListener("bossMessage", handleBossMessage);
      if (surveyReopenTimerRef.current) clearTimeout(surveyReopenTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!escapeTimerStarted || challengeFinalCompleted || !escapeTimerFlashTick) return;
    if (escapeTimerFlashTick <= lastHandledFlashTickRef.current) return;
    lastHandledFlashTickRef.current = escapeTimerFlashTick;
    setCountdownFlash(true);
    const timeoutId = setTimeout(() => setCountdownFlash(false), isCountdownCritical ? 1700 : 1300);
    return () => clearTimeout(timeoutId);
  }, [escapeTimerFlashTick, escapeTimerStarted, challengeFinalCompleted, isCountdownCritical]);

  useEffect(() => {
    if (!challengeFinalCompleted || !finalCompletionStatus || outroCompleted) return;

    setOutroLanguage(normalizedLanguage);
    setShowSurveyModal(false);
    const elapsedSinceCompletion = finalCompletionAt ? Date.now() - finalCompletionAt : 0;
    const targetDelay = finalCompletionStatus === "success"
      ? SUCCESS_OUTRO_DELAY_MS
      : FAIL_OUTRO_DELAY_MS;
    const remainingDelay = Math.max(0, targetDelay - elapsedSinceCompletion);

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

  useEffect(() => {
    if (!showOutroVideo || !outroVideoRef.current) return;
    const playPromise = outroVideoRef.current.play();
    if (playPromise?.catch) {
      playPromise.catch(() => {});
    }
  }, [showOutroVideo, outroVideoSrc]);

  const countdownText = useMemo(() => {
    const totalSeconds = Math.max(0, Math.ceil(escapeTimerRemainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, [escapeTimerRemainingMs]);

  const formattedDate = now.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="desktop-container">
      <div className="desktop-shell">
        <div className="desktop-glow" />
        <div className="desktop-clock">
          <span className="desktop-clock-time">{formattedTime}</span>
          <span className="desktop-clock-date">{formattedDate}</span>
        </div>
        {escapeTimerStarted && !challengeFinalCompleted && activeApp !== "social" && (
          <div
            className={`desktop-countdown ${isCountdownCritical ? "desktop-countdown--critical" : ""} ${countdownFlash ? "desktop-countdown--flash" : ""}`}
          >
            <span className="desktop-countdown-label">{t("shared.timeLeft")}</span>
            <span className="desktop-countdown-value">{countdownText}</span>
          </div>
        )}
      </div>

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

      <div
        className={`app-drawer open ${unreadCount > 0 ? "has-unread" : ""}`}
        style={{
          "--drawer-translate": `0px`,
          "--drawer-height": `84px`,
        }}
      >
        {/* <button
          className="app-drawer-handle"
          onClick={handleToggleDrawer}
          aria-label={drawerOpen ? "Cerrar drawer" : "Abrir drawer"}
          title={drawerOpen ? "Cerrar" : "Abrir"}
        >
          <FaChevronUp className={drawerOpen ? "arrow open" : "arrow"} />
        </button> */}

        <div className="app-drawer-content">
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
          <button
            className={`app-launcher-card ${!missionBriefRead ? "is-locked" : ""}`}
            onClick={handleOpenSocial}
            title={t("desktop.apps.social")}
          >
            <img
              className="launcher-image"
              src={assetPath("/assets/echo-logo-short-neg.png")}
              alt={t("desktop.apps.social")}
            />
            <span className="launcher-label">
              {t("desktop.apps.social")}
            </span>
          </button>
          <button
            className="app-launcher-card"
            type="button"
            onClick={handleOpenFiles}
            title={t("desktop.apps.files")}
          >
            <img
              className="launcher-image"
              src={assetPath("/assets/folder.png")}
              alt={t("desktop.apps.files")}
            />
            <span className="launcher-label">{t("desktop.apps.files")}</span>
          </button>
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

      {popup.visible && (
        <PopupNotification
          message={popup.message}
          position={popup.position}
          onClose={handleClosePopup}
        />
      )}

      <BossNotification
        visible={bossNotifVisible}
        onDismiss={handleBossNotifDismiss}
      />

      {/* Survey balloon - shows when game is complete and survey not done */}
      {/* Survey balloon - shows when game is complete OR timed out, and survey not done */}
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

      {/* Survey modal */}
      {showSurveyModal && (
        <SurveyModal
          onClose={handleCloseSurvey}
          onSubmit={handleSurveySubmit}
        />
      )}

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
              <button
                type="button"
                className="end-options-btn end-options-btn--primary"
                onClick={handleRestartSession}
              >
                {t("escapeRoomEnd.restart", "Return to the beginning")}
              </button>
              <button
                type="button"
                className="end-options-btn"
                onClick={handleCloseEndOptionsModal}
              >
                {t("escapeRoomEnd.continueExploring", "Continue exploring ECHO")}
              </button>
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
