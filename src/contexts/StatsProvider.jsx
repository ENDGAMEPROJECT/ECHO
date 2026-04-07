import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "./XAPIProvider.jsx";

const ESCAPE_TIMER_DURATION_MS = 20 * 60 * 1000;
const ESCAPE_TIMER_FLASH_INTERVAL_MS = 5 * 60 * 1000;
const ESCAPE_TIMER_CRITICAL_MS = 5 * 60 * 1000;
const ESCAPE_TIMER_CRITICAL_FLASH_INTERVAL_MS = 60 * 1000;
const ESCAPE_OUTCOME_KEY = "echo:escapeOutcome";
const ESCAPE_TIMER_PAUSED_AT_KEY = "escapeTimerPausedAt";
const FINAL_COMPLETION_STATUS_KEY = "echo:finalCompletionStatus";
const FINAL_COMPLETION_AT_KEY = "echo:finalCompletionAt";

const getStoredTimerStart = () => {
  const raw = sessionStorage.getItem("escapeTimerStartedAt");
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const getStoredTimerPausedAt = () => {
  const raw = sessionStorage.getItem(ESCAPE_TIMER_PAUSED_AT_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

/**
 * Contexto para gestionar las estadisticas del sistema
 */
const StatsContext = createContext();

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats debe usarse dentro de StatsProvider");
  }
  return context;
};

export const StatsProvider = ({ children }) => {
  const { sendStatement, trackChallengeCompleted } = useXAPI();
  const getInitialStats = () => ({
    misinformation: {
      level: 78,
      trend: "up",
    },
    postsLastHour: {
      count: 324,
      percentage: 85,
      normal: 50,
    },
    newUsersLastHour: {
      count: 156,
      percentage: 92,
      normal: 20,
    },
    trendingHashtags: [
      { tag: "#GlowUp", count: 234, suspicious: true },
      { tag: "#MiracleCure", count: 189, suspicious: true },
      { tag: "#EnergyBoost", count: 145, suspicious: true },
    ],
    botActivity: {
      percentage: 73,
      detected: 45,
    },
    engagement: {
      likes: 65,
      comments: 42,
      shares: 38,
    },
    accountAge: {
      newAccounts: 68,
      suspicious: true,
    },
  });

  const [stats, setStats] = useState(getInitialStats());

  const [challenge1Completed, setChallenge1Completed] = useState(() => {
    const saved = sessionStorage.getItem("challenge1Completed");
    return saved ? JSON.parse(saved) : false;
  });

  const [suspectUsersCount, setSuspectUsersCount] = useState(0);
  const [challenge1Progress, setChallenge1Progress] = useState(0);
  const [challenge2Total, setChallenge2Total] = useState(1);
  const [challenge2Progress, setChallenge2Progress] = useState(0);
  const [challenge3Total, setChallenge3Total] = useState(3);
  const [challenge3Progress, setChallenge3Progress] = useState(() => {
    try {
      const saved = sessionStorage.getItem("ai-incorrect:sentReplies");
      return saved ? Object.keys(JSON.parse(saved)).length : 0;
    } catch { return 0; }
  });

  const [challenge2Completed, setChallenge2Completed] = useState(() => {
    const saved = sessionStorage.getItem("challenge2Completed");
    return saved ? JSON.parse(saved) : false;
  });

  const [challenge3Completed, setChallenge3Completed] = useState(() => {
    const saved = sessionStorage.getItem("challenge3Completed");
    return saved ? JSON.parse(saved) : false;
  });

  const [challengeFinalCompleted, setChallengeFinalCompleted] = useState(() => {
    const saved = sessionStorage.getItem("challengeFinalCompleted");
    return saved ? JSON.parse(saved) : false;
  });

  // Estados para rastrear la lectura de mensajes de instrucciones
  const [challenge2InstructionsRead, setChallenge2InstructionsRead] = useState(() => {
    const saved = sessionStorage.getItem("challenge2InstructionsRead");
    return saved ? JSON.parse(saved) : false;
  });

  const [challenge3InstructionsRead, setChallenge3InstructionsRead] = useState(() => {
    const saved = sessionStorage.getItem("challenge3InstructionsRead");
    return saved ? JSON.parse(saved) : false;
  });

  const [challengeFinalInstructionsRead, setChallengeFinalInstructionsRead] = useState(() => {
    const saved = sessionStorage.getItem("challengeFinalInstructionsRead");
    return saved ? JSON.parse(saved) : false;
  });

  const [escapeTimerStartedAt, setEscapeTimerStartedAt] = useState(() => getStoredTimerStart());
  const [escapeTimerPausedAt, setEscapeTimerPausedAt] = useState(() => getStoredTimerPausedAt());
  const [escapeTimerRemainingMs, setEscapeTimerRemainingMs] = useState(() => {
    const startedAt = getStoredTimerStart();
    const pausedAt = getStoredTimerPausedAt();
    const challengeFinalCompleted = sessionStorage.getItem("challengeFinalCompleted") === "true";
    
    // Si el escape room está completado, restaurar el tiempo congelado guardado
    if (challengeFinalCompleted) {
      const savedRemainingMs = sessionStorage.getItem("escapeTimerRemainingMs");
      if (savedRemainingMs) {
        return Number(savedRemainingMs);
      }
    }
    
    if (!startedAt) return ESCAPE_TIMER_DURATION_MS;
    const referenceNow = pausedAt || Date.now();
    return Math.max(0, ESCAPE_TIMER_DURATION_MS - (referenceNow - startedAt));
  });
  const [escapeTimerFlashTick, setEscapeTimerFlashTick] = useState(0);
  const [finalCompletionStatus, setFinalCompletionStatus] = useState(
    () => sessionStorage.getItem(FINAL_COMPLETION_STATUS_KEY) || null
  );
  const [finalCompletionAt, setFinalCompletionAt] = useState(() => {
    const raw = Number(sessionStorage.getItem(FINAL_COMPLETION_AT_KEY));
    return Number.isFinite(raw) && raw > 0 ? raw : null;
  });
  const previousRemainingMsRef = useRef(escapeTimerRemainingMs);
  const timerFrozenRef = useRef(false);

  const sendEscapeOutcome = (outcome, verb, result = null, options = null) => {
    const existingOutcome = sessionStorage.getItem(ESCAPE_OUTCOME_KEY);
    if (existingOutcome) return;

    sessionStorage.setItem(ESCAPE_OUTCOME_KEY, outcome);

    sendStatement(
      verb,
      ECHO_ACTIVITIES.GAME,
      result,
      {
        contextActivities: {
          grouping: [ECHO_ACTIVITIES.GAME],
        },
      },
      null,
      options
    );
  };

  useEffect(() => {
    const savedChallenge1 = sessionStorage.getItem("challenge1Completed");
    const savedChallenge2 = sessionStorage.getItem("challenge2Completed");
    const savedChallenge3 = sessionStorage.getItem("challenge3Completed");
    const savedChallengeFinal = sessionStorage.getItem("challengeFinalCompleted");
    const savedChallenge2Instructions = sessionStorage.getItem("challenge2InstructionsRead");
    const savedChallenge3Instructions = sessionStorage.getItem("challenge3InstructionsRead");
    const savedChallengeFinalInstructions = sessionStorage.getItem("challengeFinalInstructionsRead");

    if (savedChallenge1) {
      setChallenge1Completed(JSON.parse(savedChallenge1));
    }
    if (savedChallenge2) {
      setChallenge2Completed(JSON.parse(savedChallenge2));
    }
    if (savedChallenge3) {
      setChallenge3Completed(JSON.parse(savedChallenge3));
    }
    if (savedChallengeFinal) {
      setChallengeFinalCompleted(JSON.parse(savedChallengeFinal));
    }
    if (savedChallenge2Instructions) {
      setChallenge2InstructionsRead(JSON.parse(savedChallenge2Instructions));
    }
    if (savedChallenge3Instructions) {
      setChallenge3InstructionsRead(JSON.parse(savedChallenge3Instructions));
    }
    if (savedChallengeFinalInstructions) {
      setChallengeFinalInstructionsRead(JSON.parse(savedChallengeFinalInstructions));
    }
  }, []);

  const updateStats = (newStats) => {
    setStats((prev) => ({
      ...prev,
      ...newStats,
    }));
  };

  const reduceMisinformation = (percentage = 30) => {
    setStats((prev) => ({
      ...prev,
      misinformation: {
        ...prev.misinformation,
        level: Math.max(0, prev.misinformation.level - percentage),
        trend: "down",
      },
      postsLastHour: {
        ...prev.postsLastHour,
        percentage: Math.max(0, prev.postsLastHour.percentage - 15),
      },
      newUsersLastHour: {
        ...prev.newUsersLastHour,
        percentage: Math.max(0, prev.newUsersLastHour.percentage - 20),
      },
      botActivity: {
        ...prev.botActivity,
        percentage: Math.max(0, prev.botActivity.percentage - 25),
      },
      accountAge: {
        ...prev.accountAge,
        newAccounts: Math.max(0, prev.accountAge.newAccounts - 15),
        suspicious: Math.max(0, prev.accountAge.newAccounts - 15) > 40,
      },
    }));
  };

  const completeChallenge1 = () => {
    setChallenge1Completed(true);
    sessionStorage.setItem("challenge1Completed", JSON.stringify(true));
  };

  const completeChallenge2 = () => {
    setChallenge2Completed(true);
    sessionStorage.setItem("challenge2Completed", JSON.stringify(true));
  };

  const completeChallenge3 = () => {
    setChallenge3Completed(true);
    sessionStorage.setItem("challenge3Completed", JSON.stringify(true));
  };

  const completeChallengeFinal = () => {
    const completedAt = Date.now();
    const elapsedMs = escapeTimerStartedAt ? completedAt - escapeTimerStartedAt : ESCAPE_TIMER_DURATION_MS;
    const remaining = escapeTimerStartedAt
      ? Math.max(0, ESCAPE_TIMER_DURATION_MS - elapsedMs)
      : 0;
    const completedWithinTime = elapsedMs <= ESCAPE_TIMER_DURATION_MS;
    const escapeDurationMs = ESCAPE_TIMER_DURATION_MS - remaining;

    if (escapeTimerStartedAt) {
      setEscapeTimerRemainingMs(remaining);
    }

    // Helper para convertir milisegundos a formato ISO 8601
    const msToISODuration = (ms) => {
      const totalSeconds = Math.max(0, Math.floor(ms / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      if (minutes > 0) {
        return `PT${minutes}M${seconds}S`;
      } else {
        return `PT${seconds}S`;
      }
    };

    // 1. Enviar statement COMPLETED para Puzzle 4 con trackChallengeCompleted
    trackChallengeCompleted(
      "4",
      "Puzzle 4 - Community Note",
      completedWithinTime,
      completedWithinTime ? 1 : 0
    );

    // 2. Enviar statement FINISHED para el escape room general con duración total
    const isoDuration = msToISODuration(escapeDurationMs);
    sendStatement(
      XAPI_VERBS.FINISHED,
      ECHO_ACTIVITIES.GAME,
      {
        completion: true,
        success: completedWithinTime,
        duration: isoDuration,
      }
    );

    reduceMisinformation(78);
    setChallengeFinalCompleted(true);
    sessionStorage.setItem("challengeFinalCompleted", JSON.stringify(true));
    // Guardar el tiempo congelado para que se restaure al recargar
    sessionStorage.setItem("escapeTimerRemainingMs", String(remaining));
    sessionStorage.setItem(
      FINAL_COMPLETION_STATUS_KEY,
      completedWithinTime ? "success" : "fail"
    );
    sessionStorage.setItem(FINAL_COMPLETION_AT_KEY, String(completedAt));
    setFinalCompletionStatus(completedWithinTime ? "success" : "fail");
    setFinalCompletionAt(completedAt);
  };

  const startEscapeTimer = () => {
    if (challengeFinalCompleted) return;

    const alreadyStartedAt = getStoredTimerStart();
    if (alreadyStartedAt || escapeTimerStartedAt) return;

    const startedAt = Date.now();
    sessionStorage.removeItem(ESCAPE_OUTCOME_KEY);
    sessionStorage.removeItem(ESCAPE_TIMER_PAUSED_AT_KEY);
    sessionStorage.setItem("escapeTimerStartedAt", String(startedAt));
    setEscapeTimerStartedAt(startedAt);
    setEscapeTimerPausedAt(null);
    setEscapeTimerRemainingMs(ESCAPE_TIMER_DURATION_MS);
    previousRemainingMsRef.current = ESCAPE_TIMER_DURATION_MS;
  };

  const pauseEscapeTimer = () => {
    if (!escapeTimerStartedAt || challengeFinalCompleted || escapeTimerPausedAt) return;
    const pausedAt = Date.now();
    sessionStorage.setItem(ESCAPE_TIMER_PAUSED_AT_KEY, String(pausedAt));
    setEscapeTimerPausedAt(pausedAt);
  };

  const resumeEscapeTimer = () => {
    if (!escapeTimerStartedAt || !escapeTimerPausedAt || challengeFinalCompleted) return;

    const pausedDuration = Math.max(0, Date.now() - escapeTimerPausedAt);
    const adjustedStartedAt = escapeTimerStartedAt + pausedDuration;

    sessionStorage.setItem("escapeTimerStartedAt", String(adjustedStartedAt));
    sessionStorage.removeItem(ESCAPE_TIMER_PAUSED_AT_KEY);

    setEscapeTimerStartedAt(adjustedStartedAt);
    setEscapeTimerPausedAt(null);
  };

  useEffect(() => {
    if (!escapeTimerStartedAt || timerFrozenRef.current) return;

    const tick = () => {
      if (timerFrozenRef.current) return; // Si está congelado, no actualizar
      const referenceNow = escapeTimerPausedAt || Date.now();
      const remaining = Math.max(0, ESCAPE_TIMER_DURATION_MS - (referenceNow - escapeTimerStartedAt));
      const previousRemaining = previousRemainingMsRef.current;
      setEscapeTimerRemainingMs(remaining);

      if (!challengeFinalCompleted && remaining <= 0) {
        sendEscapeOutcome("unsatisfied", XAPI_VERBS.UNSATISFIED, {
          completion: false,
          success: false,
        });
      }

      if (!challengeFinalCompleted && remaining > 0 && previousRemaining > 0) {
        const previousInterval =
          previousRemaining <= ESCAPE_TIMER_CRITICAL_MS
            ? ESCAPE_TIMER_CRITICAL_FLASH_INTERVAL_MS
            : ESCAPE_TIMER_FLASH_INTERVAL_MS;
        const currentInterval =
          remaining <= ESCAPE_TIMER_CRITICAL_MS
            ? ESCAPE_TIMER_CRITICAL_FLASH_INTERVAL_MS
            : ESCAPE_TIMER_FLASH_INTERVAL_MS;

        const previousBucket = Math.floor(previousRemaining / previousInterval);
        const currentBucket = Math.floor(remaining / currentInterval);

        if (currentBucket < previousBucket) {
          setEscapeTimerFlashTick((prev) => prev + 1);
        }
      }

      previousRemainingMsRef.current = remaining;
    };

    tick();
    if (escapeTimerPausedAt) return;

    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [escapeTimerStartedAt, challengeFinalCompleted, escapeTimerPausedAt]);

  // Cuando se completa el reto final, congelar el timer permanentemente
  useEffect(() => {
    if (challengeFinalCompleted) {
      timerFrozenRef.current = true;
      sessionStorage.removeItem("escapeTimerStartedAt");
      sessionStorage.removeItem(ESCAPE_TIMER_PAUSED_AT_KEY);
    }
  }, [challengeFinalCompleted]);

  useEffect(() => {
    const handlePageExit = () => {
      if (!escapeTimerStartedAt || challengeFinalCompleted) return;
      if (sessionStorage.getItem(ESCAPE_OUTCOME_KEY)) return;

      sendEscapeOutcome(
        "exited",
        XAPI_VERBS.EXITED,
        {
          completion: false,
          success: false,
        },
        { keepalive: true }
      );
    };

    window.addEventListener("beforeunload", handlePageExit);
    window.addEventListener("pagehide", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      window.removeEventListener("pagehide", handlePageExit);
    };
  }, [escapeTimerStartedAt, challengeFinalCompleted]);

  const markChallenge2InstructionsRead = () => {
    setChallenge2InstructionsRead(true);
    sessionStorage.setItem("challenge2InstructionsRead", JSON.stringify(true));
  };

  const markChallenge3InstructionsRead = () => {
    setChallenge3InstructionsRead(true);
    sessionStorage.setItem("challenge3InstructionsRead", JSON.stringify(true));
  };

  const markChallengeFinalInstructionsRead = () => {
    setChallengeFinalInstructionsRead(true);
    sessionStorage.setItem("challengeFinalInstructionsRead", JSON.stringify(true));
  };

  const value = {
    stats,
    updateStats,
    reduceMisinformation,
    suspectUsersCount,
    setSuspectUsersCount,
    challenge1Progress,
    setChallenge1Progress,
    challenge2Total,
    setChallenge2Total,
    challenge2Progress,
    setChallenge2Progress,
    challenge3Total,
    setChallenge3Total,
    challenge3Progress,
    setChallenge3Progress,
    challenge1Completed,
    completeChallenge1,
    challenge2Completed,
    completeChallenge2,
    challenge3Completed,
    completeChallenge3,
    challengeFinalCompleted,
    completeChallengeFinal,
    challenge2InstructionsRead,
    markChallenge2InstructionsRead,
    challenge3InstructionsRead,
    markChallenge3InstructionsRead,
    challengeFinalInstructionsRead,
    markChallengeFinalInstructionsRead,
    escapeTimerDurationMs: ESCAPE_TIMER_DURATION_MS,
    escapeTimerStarted: Boolean(escapeTimerStartedAt),
    escapeTimerStartedAt,
    escapeTimerPaused: Boolean(escapeTimerPausedAt),
    escapeTimerRemainingMs,
    // "active" means the run is ongoing until the final challenge is completed,
    // even if the countdown reached 00:00.
    escapeTimerActive: Boolean(escapeTimerStartedAt) && !challengeFinalCompleted,
    escapeTimerExpired:
      Boolean(escapeTimerStartedAt) && !challengeFinalCompleted && escapeTimerRemainingMs <= 0,
    escapeTimerFlashTick,
    finalCompletionStatus,
    finalCompletionAt,
    startEscapeTimer,
    pauseEscapeTimer,
    resumeEscapeTimer,
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};
