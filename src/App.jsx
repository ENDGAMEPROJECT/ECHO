import React, { useState, useEffect, useRef, useCallback } from "react";
import "./App.css";
import { Desktop } from "./pages/Desktop/Desktop";
import { ScrollToTop } from "./components/ScrollToTop/ScrollToTop.jsx";
import { Toaster } from "react-hot-toast";
import { PlayerOnboarding } from "./components/PlayerOnboarding/PlayerOnboarding";
import { useTranslation } from "react-i18next";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "./contexts/XAPIProvider";
import { useStats } from "./contexts/StatsProvider";

const RESUME_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Check if there's an existing session with meaningful progress.
 * - Incomplete game: always offer resume.
 * - Completed game (survey done) within 5 min: offer resume.
 * - Completed game older than 5 min: auto-restart.
 * Returns: "resume" | "restart" | false
 */
const checkExistingSession = () => {
  try {
    const playerData = sessionStorage.getItem('playerData');
    if (!playerData) return false;
    const parsed = JSON.parse(playerData);
    if (!parsed.onboardingCompleted) return false;

    const surveyCompleted = sessionStorage.getItem('surveyCompleted') === 'true';
    if (!surveyCompleted) return "resume";

    const completedAt = Number(sessionStorage.getItem('gameCompletedAt') || 0);
    if (completedAt && Date.now() - completedAt < RESUME_WINDOW_MS) {
      return "resume";
    }

    return "restart";
  } catch {
    return false;
  }
};

const getStoredXapiActor = () => {
  try {
    const raw = sessionStorage.getItem("xapiActor");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

/**
 * Componente principal de la aplicación
 *
 * Configura la estructura base de la aplicación con un sistema operativo simulado:
 * - Cuestionario inicial para configuración del jugador
 * - Escritorio con barra de tareas
 * - Aplicaciones (Red Social y Mensajes)
 * - Sistema de notificaciones toast
 */
function App() {
  const { t } = useTranslation();
  const { sendStatement } = useXAPI();
  const { pauseEscapeTimer, resumeEscapeTimer } = useStats();
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [showSessionDialog, setShowSessionDialog] = useState(false);
  const sessionDialogInitRef = useRef(false);

  const sendWithFallbackActor = useCallback((verb, object, result = null, context = null, options = null) => {
    const fallbackActor = getStoredXapiActor();
    return sendStatement(verb, object, result, context, fallbackActor, options);
  }, [sendStatement]);

  // Check for existing session on mount
  useEffect(() => {
    if (sessionDialogInitRef.current) return;
    sessionDialogInitRef.current = true;

    const sessionStatus = checkExistingSession();
    if (sessionStatus === "resume") {
      sendWithFallbackActor(XAPI_VERBS.EXITED_ADL, ECHO_ACTIVITIES.GAME);
      pauseEscapeTimer();
      setShowSessionDialog(true);
    } else if (sessionStatus === "restart") {
      sessionStorage.clear();
      window.location.reload();
    }
  }, [pauseEscapeTimer, sendWithFallbackActor]);

  const handleResume = () => {
    resumeEscapeTimer();
    // Send "resumed" statement
    sendWithFallbackActor(XAPI_VERBS.RESUMED, ECHO_ACTIVITIES.GAME);
    setShowSessionDialog(false);
    setOnboardingComplete(true);
  };

  const handleStartOver = async () => {
    await sendWithFallbackActor(XAPI_VERBS.EXITED_ADL, ECHO_ACTIVITIES.GAME);

    // Give the browser a short window to flush keepalive requests before reload.
    await new Promise((resolve) => setTimeout(resolve, 150));

    sessionStorage.clear();
    // Reload to reset all provider states
    window.location.reload();
  };

  const handleOnboardingComplete = (playerData) => {
    setOnboardingComplete(true);
  };

  return (
    <div className="App">
      {/* Session resume dialog */}
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

      {/* Mostrar cuestionario si no está completado y no hay diálogo de sesión */}
      {!onboardingComplete && !showSessionDialog && <PlayerOnboarding onComplete={handleOnboardingComplete} />}
      
      {/* Componente que resetea el scroll al inicio al cambiar de ruta */}
      <ScrollToTop />
      
      {/* Sistema de escritorio con aplicaciones */}
      <Desktop />
      
      {/* Configuración del sistema de notificaciones toast */}
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
