import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "./XAPIProvider.jsx";

// 20-minute escape room timer
const ESCAPE_TIMER_DURATION_MS = 20 * 60 * 1000;

// Flash animation intervals
const ESCAPE_TIMER_FLASH_INTERVAL_MS = 5 * 60 * 1000;  // Every 5 min
const ESCAPE_TIMER_CRITICAL_MS = 5 * 60 * 1000;        // Critical threshold (5 min remaining)
const ESCAPE_TIMER_CRITICAL_FLASH_INTERVAL_MS = 60 * 1000;  // Every 1 min when critical

// Session storage keys
const ESCAPE_OUTCOME_KEY = "echo:escapeOutcome";
const ESCAPE_TIMER_PAUSED_AT_KEY = "escapeTimerPausedAt";
const FINAL_COMPLETION_STATUS_KEY = "echo:finalCompletionStatus";
const FINAL_COMPLETION_AT_KEY = "echo:finalCompletionAt";


// Get escape timer start time from sessionStorage
const getStoredTimerStart = () => {
  const raw = sessionStorage.getItem("escapeTimerStartedAt");
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

// Get escape timer pause time from sessionStorage
const getStoredTimerPausedAt = () => {
  const raw = sessionStorage.getItem(ESCAPE_TIMER_PAUSED_AT_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

// Context for game stats: threat metrics, challenge progress, timer management
const StatsContext = createContext();

// Custom hook to access stats context
export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within StatsProvider");
  }
  return context;
};

// Context provider for game stats, challenge progression, and escape timer
export const StatsProvider = ({ children }) => {
  // Get xAPI integration functions
  const { sendStatement, trackChallengeCompleted } = useXAPI();
  
  // Initial threat metrics for the game
  const getInitialStats = () => ({
    botActivity: {
      percentage: 73,
      detected: 45,
    },
  });

  
  // Threat level metrics
  const [stats, setStats] = useState(getInitialStats());

  // Challenge 1 (Bot Detection) - persisted to sessionStorage
  const [challenge1Completed, setChallenge1Completed] = useState(() => {
    const saved = sessionStorage.getItem("challenge1Completed");
    return saved ? JSON.parse(saved) : false;
  });

  const [suspectUsersCount, setSuspectUsersCount] = useState(0);
  const [challenge1Progress, setChallenge1Progress] = useState(0);
  
  // Challenge 2 (AI Detection)
  const [challenge2Total, setChallenge2Total] = useState(1);
  const [challenge2Progress, setChallenge2Progress] = useState(0);
  
  // Challenge 3 (Content Moderation) - 3 harmful posts to moderate
  const [challenge3Total, setChallenge3Total] = useState(3);
  const [challenge3Progress, setChallenge3Progress] = useState(() => {
    try {
      const saved = sessionStorage.getItem("ai-incorrect:sentReplies");
      return saved ? Object.keys(JSON.parse(saved)).length : 0;
    } catch { return 0; }
  });

  // Challenge 2 (AI Detection) - persisted to sessionStorage
  const [challenge2Completed, setChallenge2Completed] = useState(() => {
    const saved = sessionStorage.getItem("challenge2Completed");
    return saved ? JSON.parse(saved) : false;
  });

  // Challenge 3 (Content Moderation) - persisted to sessionStorage
  const [challenge3Completed, setChallenge3Completed] = useState(() => {
    const saved = sessionStorage.getItem("challenge3Completed");
    return saved ? JSON.parse(saved) : false;
  });

  // Final Challenge (Escape Room) - timer frozen when true - persisted to sessionStorage
  const [challengeFinalCompleted, setChallengeFinalCompleted] = useState(() => {
    const saved = sessionStorage.getItem("challengeFinalCompleted");
    return saved ? JSON.parse(saved) : false;
  });


  // Instruction read tracking - persisted to sessionStorage
  const [challenge1InstructionsRead, setChallenge1InstructionsRead] = useState(() => {
    const saved = sessionStorage.getItem("challenge1InstructionsRead");
    return saved ? JSON.parse(saved) : false;
  });

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

  // Escape timer state - persisted to sessionStorage
  const [escapeTimerStartedAt, setEscapeTimerStartedAt] = useState(() => {
    const stored = getStoredTimerStart();
    console.log("🔍 StatsProvider Init - escapeTimerStartedAt from storage:", stored);
    return stored;
  });
  const [escapeTimerPausedAt, setEscapeTimerPausedAt] = useState(() => getStoredTimerPausedAt());
  
  // Escape timer remaining milliseconds
  const [escapeTimerRemainingMs, setEscapeTimerRemainingMs] = useState(() => {
    const startedAt = getStoredTimerStart();
    const pausedAt = getStoredTimerPausedAt();
    const challengeFinalCompleted = sessionStorage.getItem("challengeFinalCompleted") === "true";
    
    console.log("🔍 StatsProvider Init - Timer state:", { 
      startedAt, 
      pausedAt, 
      challengeFinalCompleted,
      escapeTimerRemainingMs: sessionStorage.getItem("escapeTimerRemainingMs")
    });
    
    // If escape room completed, restore the frozen time saved at completion
    if (challengeFinalCompleted) {
      const savedRemainingMs = sessionStorage.getItem("escapeTimerRemainingMs");
      if (savedRemainingMs) {
        return Number(savedRemainingMs);
      }
    }
    
    // Timer not started: return full duration (20 minutes)
    if (!startedAt) return ESCAPE_TIMER_DURATION_MS;
    
    // Timer started: calculate remaining time
    // Use paused time as reference if paused, otherwise use current time
    const referenceNow = pausedAt || Date.now();
    return Math.max(0, ESCAPE_TIMER_DURATION_MS - (referenceNow - startedAt));
  });
  
  const [escapeTimerFlashTick, setEscapeTimerFlashTick] = useState(0);
  
  // Final challenge result: "success" | "fail" | null
  const [finalCompletionStatus, setFinalCompletionStatus] = useState(
    () => sessionStorage.getItem(FINAL_COMPLETION_STATUS_KEY) || null
  );
  
  // Timestamp when final challenge was completed
  const [finalCompletionAt, setFinalCompletionAt] = useState(() => {
    const raw = Number(sessionStorage.getItem(FINAL_COMPLETION_AT_KEY));
    return Number.isFinite(raw) && raw > 0 ? raw : null;
  });
  
  // Refs for timer tracking
  const previousRemainingMsRef = useRef(escapeTimerRemainingMs);  // Detect flash interval crossing
  const timerFrozenRef = useRef(sessionStorage.getItem("challengeFinalCompleted") === "true");


  // Send xAPI statement for escape room outcome (exited, unsatisfied, etc.)
  const sendEscapeOutcome = (outcome, verb, result = null, options = null) => {
    // Check if outcome already recorded (prevents duplicate statements)
    const existingOutcome = sessionStorage.getItem(ESCAPE_OUTCOME_KEY);
    if (existingOutcome) return;

    // Record this outcome in sessionStorage
    sessionStorage.setItem(ESCAPE_OUTCOME_KEY, outcome);

    // Send xAPI statement
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


  // Restore persisted game progress from sessionStorage on mount
  useEffect(() => {
    const savedChallenge1 = sessionStorage.getItem("challenge1Completed");
    const savedChallenge2 = sessionStorage.getItem("challenge2Completed");
    const savedChallenge3 = sessionStorage.getItem("challenge3Completed");
    const savedChallengeFinal = sessionStorage.getItem("challengeFinalCompleted");
    const savedChallenge2Instructions = sessionStorage.getItem("challenge2InstructionsRead");
    const savedChallenge3Instructions = sessionStorage.getItem("challenge3InstructionsRead");
    const savedChallengeFinalInstructions = sessionStorage.getItem("challengeFinalInstructionsRead");
    const savedEscapeTimerRemainingMs = sessionStorage.getItem("escapeTimerRemainingMs");

    // Restore challenge completion states
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
    
    // Restore instructions read states
    if (savedChallenge2Instructions) {
      setChallenge2InstructionsRead(JSON.parse(savedChallenge2Instructions));
    }
    if (savedChallenge3Instructions) {
      setChallenge3InstructionsRead(JSON.parse(savedChallenge3Instructions));
    }
    if (savedChallengeFinalInstructions) {
      setChallengeFinalInstructionsRead(JSON.parse(savedChallengeFinalInstructions));
    }
    
    // Restore frozen timer state if escape room completed
    if (savedChallengeFinal && savedEscapeTimerRemainingMs) {
      setEscapeTimerRemainingMs(Number(savedEscapeTimerRemainingMs));
    }
  }, []);


  // Reduce threat metrics as player completes challenges
  const reduceMisinformation = (percentage = 30) => {
    setStats((prev) => ({
      ...prev,
      botActivity: {
        ...prev.botActivity,
        percentage: Math.max(0, prev.botActivity.percentage - 25),
      },
    }));
  };

  // Mark Challenge 1 complete
  const completeChallenge1 = () => {
    setChallenge1Completed(true);
    sessionStorage.setItem("challenge1Completed", JSON.stringify(true));
  };

  // Mark Challenge 2 complete
  const completeChallenge2 = () => {
    setChallenge2Completed(true);
    sessionStorage.setItem("challenge2Completed", JSON.stringify(true));
  };

  // Mark Challenge 3 complete
  const completeChallenge3 = () => {
    setChallenge3Completed(true);
    sessionStorage.setItem("challenge3Completed", JSON.stringify(true));
  };

  // Mark final challenge complete: calculate results, send xAPI, freeze timer
  const completeChallengeFinal = () => {
    const completedAt = Date.now();
    const elapsedMs = escapeTimerStartedAt ? completedAt - escapeTimerStartedAt : ESCAPE_TIMER_DURATION_MS;
    const remaining = escapeTimerStartedAt
      ? Math.max(0, ESCAPE_TIMER_DURATION_MS - elapsedMs)
      : 0;
    const completedWithinTime = elapsedMs <= ESCAPE_TIMER_DURATION_MS;
    const escapeDurationMs = ESCAPE_TIMER_DURATION_MS - remaining;

    console.log("📌 completeChallengeFinal called", { 
      escapeTimerStartedAt, 
      completedAt, 
      elapsedMs, 
      remaining, 
      escapeDurationMs 
    });
    if (escapeTimerStartedAt) {
      setEscapeTimerRemainingMs(remaining);
    }

    // Convert ms to ISO 8601 duration (PT...M...S)
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

    // Send xAPI statements
    trackChallengeCompleted(
      "4",
      "Puzzle 4 - Community Note",
      completedWithinTime,
      completedWithinTime ? 1 : 0
    );

    // Send completion to xAPI
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

    // Update stats and persist completion
    reduceMisinformation(78);
    setChallengeFinalCompleted(true);
    sessionStorage.setItem("challengeFinalCompleted", JSON.stringify(true));
    sessionStorage.setItem("escapeTimerRemainingMs", String(remaining));
    if (escapeTimerStartedAt) {
      sessionStorage.setItem("escapeTimerStartedAt", String(escapeTimerStartedAt));
    }
    
    sessionStorage.setItem("challengeFinalCompleted", JSON.stringify(true));
    sessionStorage.setItem(
      FINAL_COMPLETION_STATUS_KEY,
      completedWithinTime ? "success" : "fail"
    );
    sessionStorage.setItem(FINAL_COMPLETION_AT_KEY, String(completedAt));
    setFinalCompletionStatus(completedWithinTime ? "success" : "fail");
    setFinalCompletionAt(completedAt);
  };


  // Start the 20-minute escape room countdown
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

  // Pause the 20-minute countdown until resumed
  const pauseEscapeTimer = () => {
    if (!escapeTimerStartedAt || challengeFinalCompleted || escapeTimerPausedAt) return;
    const pausedAt = Date.now();
    sessionStorage.setItem(ESCAPE_TIMER_PAUSED_AT_KEY, String(pausedAt));
    setEscapeTimerPausedAt(pausedAt);
  };

  // Resume the countdown from paused state (adjusts start time)
  const resumeEscapeTimer = () => {
    if (!escapeTimerStartedAt || !escapeTimerPausedAt || challengeFinalCompleted) return;

    const pausedDuration = Math.max(0, Date.now() - escapeTimerPausedAt);
    const adjustedStartedAt = escapeTimerStartedAt + pausedDuration;

    sessionStorage.setItem("escapeTimerStartedAt", String(adjustedStartedAt));
    sessionStorage.removeItem(ESCAPE_TIMER_PAUSED_AT_KEY);

    setEscapeTimerStartedAt(adjustedStartedAt);
    setEscapeTimerPausedAt(null);
  };


  // Timer countdown: update every 1 second, trigger flash animations at intervals
  useEffect(() => {
    // If timer not started or is frozen, skip all updates
    if (!escapeTimerStartedAt || timerFrozenRef.current) return;

    // Single immediate tick call to update timer right away
    const tick = () => {
      // Guard: if timer is frozen, don't update
      if (timerFrozenRef.current) return;
      
      // Calculate remaining time
      // Use paused time as reference if paused, otherwise use current time
      const referenceNow = escapeTimerPausedAt || Date.now();
      const remaining = Math.max(0, ESCAPE_TIMER_DURATION_MS - (referenceNow - escapeTimerStartedAt));
      const previousRemaining = previousRemainingMsRef.current;
      setEscapeTimerRemainingMs(remaining);

      // If timer expired and challenge not complete, send unsatisfied statement
      if (!challengeFinalCompleted && remaining <= 0) {
        sendEscapeOutcome("unsatisfied", XAPI_VERBS.UNSATISFIED, {
          completion: false,
          success: false,
        });
      }

      // Check if we've crossed a flash interval threshold
      if (!challengeFinalCompleted && remaining > 0 && previousRemaining > 0) {
        // Determine which flash interval applies (normal or critical)
        const previousInterval =
          previousRemaining <= ESCAPE_TIMER_CRITICAL_MS
            ? ESCAPE_TIMER_CRITICAL_FLASH_INTERVAL_MS
            : ESCAPE_TIMER_FLASH_INTERVAL_MS;
        const currentInterval =
          remaining <= ESCAPE_TIMER_CRITICAL_MS
            ? ESCAPE_TIMER_CRITICAL_FLASH_INTERVAL_MS
            : ESCAPE_TIMER_FLASH_INTERVAL_MS;

        // Calculate which interval "bucket" we're in
        // Bucket = floor(remaining / interval)
        const previousBucket = Math.floor(previousRemaining / previousInterval);
        const currentBucket = Math.floor(remaining / currentInterval);

        // If bucket decreased, we've entered a new interval - trigger flash animation
        if (currentBucket < previousBucket) {
          setEscapeTimerFlashTick((prev) => prev + 1);
        }
      }

      // Update ref with current remaining time for next iteration
      previousRemainingMsRef.current = remaining;
    };

    // Call tick immediately
    tick();
    
    // If timer is paused, don't set interval (frozen time)
    if (escapeTimerPausedAt) return;

    // Set up interval for 1-second ticks
    const intervalId = setInterval(tick, 1000);
    
    // Cleanup: clear interval on unmount or when timer paused
    return () => clearInterval(intervalId);
  }, [escapeTimerStartedAt, challengeFinalCompleted, escapeTimerPausedAt]);


  // Freeze timer when final challenge completes
  useEffect(() => {
    if (challengeFinalCompleted) {
      timerFrozenRef.current = true;
      sessionStorage.removeItem(ESCAPE_TIMER_PAUSED_AT_KEY);
    }
  }, [challengeFinalCompleted]);


  // Track page exit while escape room is active
  useEffect(() => {
    const handlePageExit = () => {
      if (!escapeTimerStartedAt || challengeFinalCompleted) return;
      if (sessionStorage.getItem(ESCAPE_OUTCOME_KEY)) return;

      // Send EXITED with keepalive to ensure delivery
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

    // Listen for page unload events
    window.addEventListener("beforeunload", handlePageExit);
    window.addEventListener("pagehide", handlePageExit);

    return () => {
      window.removeEventListener("beforeunload", handlePageExit);
      window.removeEventListener("pagehide", handlePageExit);
    };
  }, [escapeTimerStartedAt, challengeFinalCompleted]);


  // Mark Challenge 2 instructions read
  const markChallenge2InstructionsRead = () => {
    setChallenge2InstructionsRead(true);
    sessionStorage.setItem("challenge2InstructionsRead", JSON.stringify(true));
  };

  // Mark Challenge 1 instructions read
  const markChallenge1InstructionsRead = () => {
    setChallenge1InstructionsRead(true);
    sessionStorage.setItem("challenge1InstructionsRead", JSON.stringify(true));
  };

  // Mark Challenge 3 instructions read
  const markChallenge3InstructionsRead = () => {
    setChallenge3InstructionsRead(true);
    sessionStorage.setItem("challenge3InstructionsRead", JSON.stringify(true));
  };

  // Mark Final Challenge instructions read
  const markChallengeFinalInstructionsRead = () => {
    setChallengeFinalInstructionsRead(true);
    sessionStorage.setItem("challengeFinalInstructionsRead", JSON.stringify(true));
  };


  /**
   * Context Value Object
   * 
   * All stats, states, and functions available to consuming components via useStats hook.
   * Organized by category for clarity.
   */
  const value = {
    // ===== THREAT STATISTICS =====
    stats,                    // Current threat level metrics
    reduceMisinformation,    // Function to reduce misinformation (called by challenges)
    
    // ===== CHALLENGE 1: BOT DETECTION =====
    suspectUsersCount,              // # of suspect users identified (0 to N)
    setSuspectUsersCount,           // Function to update count
    challenge1Progress,             // Current progress (# of bots removed)
    setChallenge1Progress,          // Function to update progress
    challenge1Completed,            // Boolean: challenge completed?
    completeChallenge1,             // Function to mark challenge complete
    
    // ===== CHALLENGE 2: AI DETECTION =====
    challenge2Total,                // Total items in challenge (1 AI post)
    setChallenge2Total,             // Function to update total
    challenge2Progress,             // Current progress (# identified)
    setChallenge2Progress,          // Function to update progress
    challenge2Completed,            // Boolean: challenge completed?
    completeChallenge2,             // Function to mark challenge complete
    
    // ===== CHALLENGE 3: CONTENT MODERATION =====
    challenge3Total,                // Total items in challenge (3 harmful posts)
    setChallenge3Total,             // Function to update total
    challenge3Progress,             // Current progress (# moderated)
    setChallenge3Progress,          // Function to update progress
    challenge3Completed,            // Boolean: challenge completed?
    completeChallenge3,             // Function to mark challenge complete
    
    // ===== FINAL CHALLENGE: ESCAPE ROOM =====
    challengeFinalCompleted,        // Boolean: final challenge completed?
    completeChallengeFinal,         // Function to mark final challenge complete
    
    // ===== INSTRUCTIONS READ TRACKING =====
    challenge1InstructionsRead,                    // Were Challenge 1 instructions read?
    markChallenge1InstructionsRead,               // Function to mark as read
    challenge2InstructionsRead,                   // Were Challenge 2 instructions read?
    markChallenge2InstructionsRead,               // Function to mark as read
    challenge3InstructionsRead,                   // Were Challenge 3 instructions read?
    markChallenge3InstructionsRead,               // Function to mark as read
    challengeFinalInstructionsRead,               // Were Final instructions read?
    markChallengeFinalInstructionsRead,           // Function to mark as read
    
    // ===== ESCAPE TIMER STATE & CONTROL =====
    escapeTimerDurationMs:        ESCAPE_TIMER_DURATION_MS,    // Full duration (20 minutes in ms)
    escapeTimerStarted:           Boolean(escapeTimerStartedAt),  // Has timer been started?
    escapeTimerStartedAt:         escapeTimerStartedAt,           // Timestamp when started
    escapeTimerPaused:            Boolean(escapeTimerPausedAt),    // Is timer paused?
    escapeTimerRemainingMs:       escapeTimerRemainingMs,         // Milliseconds remaining
    escapeTimerActive:            Boolean(escapeTimerStartedAt) && !challengeFinalCompleted,  // Timer running & not completed
    escapeTimerExpired:           Boolean(escapeTimerStartedAt) && !challengeFinalCompleted && escapeTimerRemainingMs <= 0,  // Time up & not completed
    escapeTimerFlashTick:         escapeTimerFlashTick,   // Counter for flash animations
    
    // Timer control functions
    startEscapeTimer,             // Start the 20-minute countdown
    pauseEscapeTimer,             // Pause the timer (freeze at current time)
    resumeEscapeTimer,            // Resume from paused state
    
    // ===== FINAL CHALLENGE RESULTS =====
    finalCompletionStatus,        // "success" if completed on-time, "fail" if expired
    finalCompletionAt,            // Timestamp when final challenge completed
  };

  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
};
