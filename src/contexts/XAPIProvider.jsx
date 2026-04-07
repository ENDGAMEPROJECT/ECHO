import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const XAPIContext = createContext();

// xAPI LRS configuration from environment variables
const XAPI_ENDPOINT = import.meta.env.VITE_XAPI_ENDPOINT;
// Pre-encoded Basic auth token (base64 of key:secret)
const XAPI_AUTH = import.meta.env.VITE_XAPI_AUTH;

// Base IRIs for ENDGAME project
const ENDGAME_BASE = "https://endgameproject.github.io/xapi";
const RWTH_VERBS = "https://xapi.elearn.rwth-aachen.de/definitions/ide/verbs";
const RWTH_ACTIVITIES = "https://xapi.elearn.rwth-aachen.de/definitions/seriousGames/activities";

// Common xAPI verbs
export const XAPI_VERBS = {
  ACCESSED: {
    id: "https://xapi.elearn.rwth-aachen.de/definitions/lms/verbs/accessed",
    display: { en: "accessed" },
  },
  STARTED: {
    id: `${RWTH_VERBS}/started`,
    display: { en: "started" },
  },
  INITIALIZED: {
    id: "http://adlnet.gov/expapi/verbs/initialized",
    display: { en: "initialized" },
  },
  COMPLETED: {
    id: "http://adlnet.gov/expapi/verbs/completed",
    display: { en: "completed" },
  },
  COMPLETED_GENERIC: {
    id: "https://xapi.elearn.rwth-aachen.de/definitions/generic/verbs/completed",
    display: { en: "completed" },
  },
  ANSWERED: {
    id: "http://adlnet.gov/expapi/verbs/answered",
    display: { en: "answered" },
  },
  EXPERIENCED: {
    id: "http://adlnet.gov/expapi/verbs/experienced",
    display: { en: "experienced" },
  },
  ASKED: {
    id: "https://xapi.elearn.rwth-aachen.de/definitions/generic/verbs/asked",
    display: { en: "asked" },
  },
  LOOKED_AT: {
    id: "https://xapi.elearn.rwth-aachen.de/definitions/generic/verbs/lookedAt",
    display: { en: "looked at" },
  },
  ATTEMPTED: {
    id: "http://adlnet.gov/expapi/verbs/attempted",
    display: { en: "attempted" },
  },
  SUCCEEDED: {
    id: "https://w3id.org/xapi/adl/verbs/succeeded",
    display: { en: "succeeded" },
  },
  FAILED: {
    id: "http://adlnet.gov/expapi/verbs/failed",
    display: { en: "failed" },
  },
  UNSATISFIED: {
    id: "http://activitystrea.ms/schema/1.0/unsatisfy",
    display: { en: "unsatisfied" },
  },
  EXITED: {
    id: "https://xapi.elearn.rwth-aachen.de/definitions/virtualReality/verbs/exited",
    display: { en: "exited" },
  },
  INTERACTED: {
    id: "http://adlnet.gov/expapi/verbs/interacted",
    display: { en: "interacted" },
  },
  LAUNCHED: {
    id: "http://adlnet.gov/expapi/verbs/launched",
    display: { en: "launched" },
  },
  PROGRESSED: {
    id: "http://adlnet.gov/expapi/verbs/progressed",
    display: { en: "progressed" },
  },
  EVALUATED: {
    id: "http://www.tincanapi.co.uk/verbs/evaluated",
    display: { en: "evaluated" },
  },
  RESUMED: {
    id: "http://adlnet.gov/expapi/verbs/resumed",
    display: { en: "resumed" },
  },
  EXITED_ADL: {
    id: "http://adlnet.gov/expapi/verbs/exited",
    display: { en: "exited" },
  },
  FINISHED: {
    id: "https://xapi.elearn.rwth-aachen.de/definitions/seriousGames/verbs/finished",
    display: { en: "finished" },
  },
};

// Activity types
export const XAPI_ACTIVITY_TYPES = {
  GAME: `${RWTH_ACTIVITIES}/game`,
  LEVEL: `${RWTH_ACTIVITIES}/level`,
  PUZZLE: "http://adlnet.gov/expapi/activities/assessment",
};

// ENDGAME ECHO escape room activities
export const ECHO_ACTIVITIES = {
  GAME: {
    id: `${ENDGAME_BASE}/escape-rooms/echo`,
    definition: {
      name: { en: "ECHO" },
      type: XAPI_ACTIVITY_TYPES.GAME,
    },
  },
  SOCIAL_APP: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/social-media-app`,
    definition: {
      name: { en: "ECHO Social Media App" },
      type: XAPI_ACTIVITY_TYPES.GAME,
    },
  },
  PROFILE: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/profile`,
    definition: {
      name: { en: "ECHO Profile" },
      type: "http://adlnet.gov/expapi/activities/profile",
    },
  },
  INTRO: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/intro`,
    definition: {
      name: { en: "Intro" },
      type: XAPI_ACTIVITY_TYPES.LEVEL,
    },
  },
  PUZZLE_1: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/puzzle-1`,
    definition: {
      name: { en: "Puzzle 1 - Bot Detection" },
      type: XAPI_ACTIVITY_TYPES.PUZZLE,
    },
  },
  PUZZLE_2: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/puzzle-2`,
    definition: {
      name: { en: "Puzzle 2 - AI Content" },
      type: XAPI_ACTIVITY_TYPES.PUZZLE,
    },
  },
  PUZZLE_3: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/puzzle-3`,
    definition: {
      name: { en: "Puzzle 3 - AI Incorrect Uses" },
      type: XAPI_ACTIVITY_TYPES.PUZZLE,
    },
  },
  FINAL: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/final`,
    definition: {
      name: { en: "Puzzle 4 - Community Note" },
      type: XAPI_ACTIVITY_TYPES.PUZZLE,
    },
  },
  FILES_APP: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/files-app`,
    definition: {
      name: { en: "ECHO File Explorer" },
      type: XAPI_ACTIVITY_TYPES.GAME,
    },
  },
  SURVEY: {
    id: `${ENDGAME_BASE}/escape-rooms/echo/survey`,
    definition: {
      name: { en: "ECHO Post-Game Survey" },
      type: "http://adlnet.gov/expapi/activities/survey",
    },
  },
};

// Extension URIs
export const XAPI_EXTENSIONS = {
  PLAYER_AGE: `${ENDGAME_BASE}/ext/playerAge`,
  LANG: `${ENDGAME_BASE}/ext/lang`,
};

export const XAPIProvider = ({ children }) => {
  const [actor, setActor] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);

  const isDev = import.meta.env.DEV;

  // Check if xAPI is properly configured
  useEffect(() => {
    const configured = !!(XAPI_ENDPOINT && XAPI_AUTH);
    setIsConfigured(configured);
    if (!configured && isDev) {
      console.warn("xAPI is not fully configured. Check VITE_XAPI_ENDPOINT and VITE_XAPI_AUTH in .env");
    }
  }, [isDev]);

  // Initialize actor from player data (called after onboarding)
  const initializeActor = useCallback((playerData) => {
    if (!playerData) return;

    const { name, age, language } = playerData;

    // Create a unique identifier for the actor
    const uniqueId = `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;

    const newActor = {
      objectType: "Agent",
      name: name,
      account: {
        homePage: ENDGAME_BASE,
        name: uniqueId,
      },
    };

    // Store actor extensions for additional context
    newActor.extensions = {
      [XAPI_EXTENSIONS.PLAYER_AGE]: age,
      [XAPI_EXTENSIONS.LANG]: language,
    };

    setActor(newActor);

    // Persist actor to sessionStorage
    sessionStorage.setItem("xapiActor", JSON.stringify(newActor));

    return newActor;
  }, []);

  // Restore actor from sessionStorage on mount
  useEffect(() => {
    const storedActor = sessionStorage.getItem("xapiActor");
    if (storedActor) {
      try {
        setActor(JSON.parse(storedActor));
      } catch (e) {
        if (isDev) console.error("[xAPI] Failed to parse stored actor:", e);
      }
    }
  }, [isDev]);

  // Send xAPI statement to LRS (non-blocking, fails silently in production)
  // actorOverride can be passed when calling immediately after initializeActor (before state updates)
  const sendStatement = useCallback(async (verb, object, result = null, context = null, actorOverride = null, options = null) => {
    const currentActor = actorOverride || actor;
    let dedupKey = null;
    let dedupStamp = null;

    // Early return without interrupting the game
    if (!isConfigured) {
      if (isDev) console.warn("[xAPI] Not configured, statement not sent:", verb?.display?.en || verb);
      return null;
    }

    if (!currentActor) {
      if (isDev) console.warn("[xAPI] Actor not initialized, statement not sent");
      return null;
    }

    // Transport-level dedup for rapid duplicate lifecycle signals.
    // beforeunload/pagehide (and occasional double handlers) can fire almost simultaneously.
    if (
      !options?.bypassDedup &&
      (
        verb?.id === XAPI_VERBS.EXITED.id ||
        verb?.id === XAPI_VERBS.EXITED_ADL.id ||
        verb?.id === XAPI_VERBS.RESUMED.id
      )
    ) {
      dedupKey = `xapi:dedup:${verb.id}`;
      const now = Date.now();
      const lastRaw = sessionStorage.getItem(dedupKey);
      const lastTs = Number(lastRaw);
      const isExitVerb = verb?.id === XAPI_VERBS.EXITED.id || verb?.id === XAPI_VERBS.EXITED_ADL.id;
      const dedupWindowMs = isExitVerb ? 5000 : 2000;

      if (Number.isFinite(lastTs) && now - lastTs < dedupWindowMs) {
        if (isDev) console.warn(`[xAPI] Deduped statement: ${verb?.display?.en || verb?.id}`);
        return null;
      }
      dedupStamp = String(now);
      sessionStorage.setItem(dedupKey, dedupStamp);
    }

    // Build the statement
    const statement = {
      actor: {
        objectType: currentActor.objectType,
        name: currentActor.name,
        account: currentActor.account,
      },
      verb: verb,
      object: {
        objectType: "Activity",
        id: typeof object === "string" ? `${ENDGAME_BASE}/activities/${object}` : object.id,
        definition: typeof object === "string"
          ? { name: { en: object } }
          : object.definition,
      },
      timestamp: new Date().toISOString(),
    };

    // Add result if provided
    if (result) {
      statement.result = result;
    }

    // Add context if provided
    if (context) {
      statement.context = context;
    }

    // Add actor extensions as context
    if (currentActor.extensions) {
      statement.context = {
        ...statement.context,
        extensions: {
          ...(statement.context?.extensions || {}),
          ...currentActor.extensions,
        },
      };
    }

    // Send asynchronously without blocking
    try {
      if (isDev) console.log("[xAPI] Sending statement:", verb?.display?.en || verb, object?.id || object);

      const response = await fetch(`${XAPI_ENDPOINT}/statements`, {
        method: "POST",
        keepalive: Boolean(options?.keepalive),
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${XAPI_AUTH}`,
          "X-Experience-API-Version": "1.0.3",
        },
        body: JSON.stringify(statement),
      });

      if (!response.ok) {
        throw new Error(`xAPI request failed: ${response.status} ${response.statusText}`);
      }

      const statementId = await response.json();
      if (isDev) console.log("[xAPI] Statement sent successfully:", statementId);
      return statementId;
    } catch (error) {
      if (dedupKey && dedupStamp && sessionStorage.getItem(dedupKey) === dedupStamp) {
        sessionStorage.removeItem(dedupKey);
      }
      // Log error only in dev mode, never interrupt the game
      if (isDev) console.error("[xAPI] Failed to send statement:", error.message);
      return null;
    }
  }, [actor, isConfigured, isDev]);

  // Helper functions for common statements
  const trackChallengeStarted = useCallback((puzzleId, puzzleName) => {
    sessionStorage.setItem(`echo:challengeStart:${puzzleId}`, Date.now().toString());
    sessionStorage.removeItem(`echo:challengeCompleted:${puzzleId}`);

    return sendStatement(
      XAPI_VERBS.INITIALIZED,
      {
        id: `${ENDGAME_BASE}/activities/puzzle/${puzzleId}`,
        definition: {
          name: { "en-US": puzzleName },
          type: "http://adlnet.gov/expapi/activities/assessment",
        },
      }
    );
  }, [sendStatement]);

  const trackChallengeCompleted = useCallback((puzzleId, puzzleName, success = true, score = null) => {
  // Evita dobles envíos (doble click / rerender)
  const completedKey = `echo:challengeCompleted:${puzzleId}`;
  if (sessionStorage.getItem(completedKey)) return null;
  sessionStorage.setItem(completedKey, "1");

  const activityObject = {
    id: `${ENDGAME_BASE}/activities/puzzle/${puzzleId}`,
    definition: {
      name: { "en-US": puzzleName },
      type: "http://adlnet.gov/expapi/activities/assessment",
    },
  };

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

  // Statement 1: succeeded — indica que el jugador lo resolvió correctamente
  const succeededResult = { success: true, completion: true };
  if (score !== null) {
    succeededResult.score = { scaled: score };
  }
  sendStatement(XAPI_VERBS.SUCCEEDED, activityObject, succeededResult);

  // Statement 2: completed — indica la duración desde que se inició el reto
  const completedResult = { completion: true };
  const startRaw = sessionStorage.getItem(`echo:challengeStart:${puzzleId}`);
  const startedAtMs = startRaw ? Number(startRaw) : null;
  if (startedAtMs && Number.isFinite(startedAtMs)) {
    const durationMs = Date.now() - startedAtMs;
    completedResult.duration = msToISODuration(durationMs);
    completedResult.extensions = {
      [`${ENDGAME_BASE}/ext/durationMs`]: durationMs,
    };
  }
  sessionStorage.removeItem(`echo:challengeStart:${puzzleId}`);
  return sendStatement(XAPI_VERBS.COMPLETED, activityObject, completedResult);
}, [sendStatement]);

  const trackInteraction = useCallback((activityId, activityName, response = null) => {
    const result = response ? { response } : null;

    return sendStatement(
      XAPI_VERBS.INTERACTED,
      {
        id: `${ENDGAME_BASE}/activities/${activityId}`,
        definition: {
          name: { "en-US": activityName },
          type: "http://adlnet.gov/expapi/activities/interaction",
        },
      },
      result
    );
  }, [sendStatement]);

  const trackProgress = useCallback((activityId, activityName, progressPercent) => {
    return sendStatement(
      XAPI_VERBS.PROGRESSED,
      {
        id: `${ENDGAME_BASE}/activities/${activityId}`,
        definition: {
          name: { "en-US": activityName },
        },
      },
      {
        extensions: {
          [`${ENDGAME_BASE}/extensions/progress`]: progressPercent,
        },
      }
    );
  }, [sendStatement]);

  const trackQuizAnswered = useCallback((username, selectedIndicators = [], correctIndicators = []) => {
    if (!username) return null;

    const selected = [...new Set(selectedIndicators.map(String))];
    const correct = [...new Set(correctIndicators.map(String))];

    const selectedSet = new Set(selected);
    const correctSet = new Set(correct);

    const isCorrect =
      selectedSet.size === correctSet.size &&
      Array.from(selectedSet).every((item) => correctSet.has(item));

    const missingIndicators = correct.filter((item) => !selectedSet.has(item));
    const incorrectlySelected = selected.filter((item) => !correctSet.has(item));
    const matchedCount = selected.filter((item) => correctSet.has(item)).length;
    const selectionAccuracy = correct.length > 0 ? matchedCount / correct.length : 1;

    return sendStatement(
      XAPI_VERBS.ANSWERED,
      {
        id: `${ENDGAME_BASE}/activities/puzzle/1/quiz/${username}`,
        definition: {
          name: { "en-US": `Bot Indicators Quiz: ${username}` },
          type: "http://adlnet.gov/expapi/activities/assessment",
        },
      },
      {
        success: isCorrect,
        score: {
          scaled: isCorrect ? 1 : 0,
          raw: isCorrect ? 1 : 0,
          min: 0,
          max: 1,
        },
        response: selected.length > 0 ? selected.join(",") : "none",
        extensions: {
          [`${ENDGAME_BASE}/ext/quiz/targetUsername`]: username,
          [`${ENDGAME_BASE}/ext/quiz/selectedIndicators`]: selected,
          [`${ENDGAME_BASE}/ext/quiz/correctIndicators`]: correct,
          [`${ENDGAME_BASE}/ext/quiz/missingIndicators`]: missingIndicators,
          [`${ENDGAME_BASE}/ext/quiz/incorrectlySelected`]: incorrectlySelected,
          [`${ENDGAME_BASE}/ext/quiz/selectionAccuracy`]: selectionAccuracy,
        },
      },
      {
        contextActivities: {
          parent: [ECHO_ACTIVITIES.PUZZLE_1],
          grouping: [ECHO_ACTIVITIES.GAME],
        },
      }
    );
  }, [sendStatement]);

  const value = {
    actor,
    isConfigured,
    initializeActor,
    sendStatement,
    trackChallengeStarted,
    trackChallengeCompleted,
    trackInteraction,
    trackProgress,
    trackQuizAnswered,
    XAPI_VERBS,
  };

  return (
    <XAPIContext.Provider value={value}>
      {children}
    </XAPIContext.Provider>
  );
};

export const useXAPI = () => {
  const context = useContext(XAPIContext);
  if (!context) {
    throw new Error("useXAPI must be used within an XAPIProvider");
  }
  return context;
};

export default XAPIProvider;
