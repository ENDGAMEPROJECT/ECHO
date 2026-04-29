// App: Main root component - handles session management, onboarding, desktop layout, and notifications

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { Desktop } from "./pages/Desktop/Desktop";  // Desktop OS interface
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop.jsx";  // Reset scroll on route change
import { Toaster } from "react-hot-toast";  // Notification system
import { PlayerOnboarding } from "./components/PlayerOnboarding/PlayerOnboarding";  // Setup questionnaire
import { useTranslation } from "react-i18next";  // i18n support
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "./contexts/XAPIProvider";  // Learning tracking
import { useStats } from "./contexts/StatsProvider";  // Game statistics

const RESUME_WINDOW_MS = 5 * 60 * 1000; // Allow resume for 5 min after completion

// Check if player has an existing session - returns "resume" | "resume-onboarding" | "restart" | false
const checkExistingSession = () => {
  try {
    // Completed onboarding — check if the full game session can be resumed
    const playerData = sessionStorage.getItem('playerData');
    if (playerData) {
      const parsed = JSON.parse(playerData);
      if (parsed.onboardingCompleted) {
        const surveyCompleted = sessionStorage.getItem('surveyCompleted') === 'true';
        if (!surveyCompleted) return "resume";

        const completedAt = Number(sessionStorage.getItem('gameCompletedAt') || 0);
        if (completedAt && Date.now() - completedAt < RESUME_WINDOW_MS) {
          return "resume";
        }

        return "restart";
      }
    }

    // Onboarding checkpoint — user was in the pretest when they refreshed
    if (sessionStorage.getItem('onboarding:checkpoint')) return "resume-onboarding";

    return false;
  } catch {
    return false;
  }
};

// Get stored XAPI actor (user identity) for learning statements
const getStoredXapiActor = () => {
  try {
    const raw = sessionStorage.getItem("xapiActor");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

function App() {
  const { t } = useTranslation();
  const { sendStatement } = useXAPI();
  const { pauseEscapeTimer, resumeEscapeTimer } = useStats();
  
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  // Tracks the kind of session detected: "resume" (full game) | "resume-onboarding" (pretest checkpoint)
  const [sessionType, setSessionType] = useState(null);
  const sessionDialogInitRef = useRef(false);

  // Wrapper for XAPI tracking with fallback actor

  const sendWithFallbackActor = useCallback((verb, object, result = null, context = null, options = null) => {
    const fallbackActor = getStoredXapiActor();
    return sendStatement(verb, object, result, context, fallbackActor, options);
  }, [sendStatement]);

  // Check for existing session on mount
  useEffect(() => {
    if (sessionDialogInitRef.current) return;
    sessionDialogInitRef.current = true;

    const sessionStatus = checkExistingSession();
    if (sessionStatus === "resume" || sessionStatus === "resume-onboarding") {
      setSessionType(sessionStatus);
      if (sessionStatus === "resume") {
        sendWithFallbackActor(XAPI_VERBS.EXITED_ADL, ECHO_ACTIVITIES.GAME);
        pauseEscapeTimer();
      }
      setShowSessionDialog(true);
    } else if (sessionStatus === "restart") {
      sessionStorage.clear();
      window.location.reload();
    }
  }, [pauseEscapeTimer, sendWithFallbackActor]);

  // Handle resume: continue previous game or resume onboarding from pretest
  const handleResume = () => {
    setShowSessionDialog(false);
    if (sessionType === "resume-onboarding") {
      // Let PlayerOnboarding restore from checkpoint — don't skip onboarding
      return;
    }
    resumeEscapeTimer();
    sendWithFallbackActor(XAPI_VERBS.RESUMED, ECHO_ACTIVITIES.GAME);
    setOnboardingComplete(true);
  };

  // Handle start over: clear storage and restart game
  const handleStartOver = async () => {
    if (sessionType === "resume") {
      await sendWithFallbackActor(XAPI_VERBS.EXITED_ADL, ECHO_ACTIVITIES.GAME);
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
    sessionStorage.clear();
    window.location.reload();
  };

  // Handle onboarding complete: proceed to game
  const handleOnboardingComplete = (playerData) => {
    setOnboardingComplete(true);
  };

  return (
    <div className="App">
      {/* Session resume dialog - offer to continue or restart */}
      {showSessionDialog && (
        <div className="session-dialog-overlay">
          <div className="session-dialog">
            <h2>{t('sessionDialog.title', 'Welcome Back!')}</h2>
            <p>{t('sessionDialog.message', 'You have a previous session. Would you like to continue where you left off?')}</p>
            <div className="session-dialog-buttons">
              <button className="session-btn session-btn-resume" onClick={handleResume}>
                {t('sessionDialog.resume', 'Resume')}
              </button>
              <button className="session-btn session-btn-start-over" onClick={handleStartOver}>
                {t('sessionDialog.startOver', 'Start Over')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding questionnaire - only show if not complete and no session dialog */}
      {!onboardingComplete && !showSessionDialog && <PlayerOnboarding onComplete={handleOnboardingComplete} />}
      
      {/* Scroll to top on route changes */}
      <ScrollToTop />
      
      {/* Desktop OS interface */}
      <Desktop />
      
      {/* Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          success: { duration: 1500 },
          error: { duration: 1500 },
        }}
        containerStyle={{
          top: "6rem",
          bottom: "80px",
        }}
      />
    </div>
  );
}

export default App;
