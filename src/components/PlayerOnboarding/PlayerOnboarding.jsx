import "./PlayerOnboarding.css";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
// xAPI tracker context for learning analytics - tracks player interactions
// XAPI_VERBS: constants for xAPI verb types (STARTED, ANSWERED, etc.)
// ECHO_ACTIVITIES: predefined activities for game progression
// XAPI_EXTENSIONS: custom extension fields for game-specific tracking
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES, XAPI_EXTENSIONS } from "../../contexts/XAPIProvider.jsx";
// Stats context - provides game statistics and state management
import { useStats } from "../../contexts/StatsProvider.jsx";
// Pre-test statements data (localized true/false statements for knowledge assessment)
import statementsData from "../../pages/CommunityNote/CommunityNoteStatements.json";
// Utility for resolving asset paths (videos, images, etc.)
import { assetPath } from "../../utils/assetPath";

/**
 * PlayerOnboarding Component
 * 
 * Complete onboarding flow for new players including:
 * - Player profile form (name, age)
 * - Language selection with flag icons
 * - Intro video playback (supports multi-language videos)
 * - Pre-test quiz (selects required true/false statements)
 * - xAPI tracking of all onboarding interactions
 * - Session initialization for the escape room game
 * 
 * @param {Function} onComplete - Callback fired when onboarding completes with finalizedPlayerData
 * @returns {JSX.Element} Full-screen onboarding overlay with conditional rendering of steps
 */
// Module-level cache — survives component re-mounts but is cleared on page
// refresh or "Start Over" (both trigger a full page reload).
let _cachedName = "";
let _cachedAge = "";

export const PlayerOnboarding = ({ onComplete }) => {
  // i18n hook - t() for translations, i18n for language configuration and change
  const { i18n, t } = useTranslation();
  
  // xAPI context - initializeActor creates player profile for tracking, sendStatement logs interactions
  const { initializeActor, sendStatement } = useXAPI();
  // Stats context - startEscapeTimer begins the game countdown timer after onboarding
  const { startEscapeTimer } = useStats();
  
  // Current step in onboarding flow: "playerForm" → "intro1Video" → "pretest" → "intro2Video" → complete
  const [step, setStep] = useState("playerForm");
  // Form field states for player profile
  const [playerName, setPlayerName] = useState(_cachedName);
  const [playerAge, setPlayerAge] = useState(_cachedAge);
  // Selected language for the game session (affects video selection and text translations)
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || "en");
  // Form validation errors - keys are field names (name, age)
  const [errors, setErrors] = useState({});
  // Stores player profile data once form is validated (name, age, language)
  const [playerData, setPlayerData] = useState(null);
  // Array of selected statement IDs from pre-test quiz
  const [selectedStatements, setSelectedStatements] = useState([]);
  // Tracks availability of intro1 and intro2 videos for selected language (async probe results)
  const [videoAvailability, setVideoAvailability] = useState({ intro1: false, intro2: false });
  // True when browser blocks autoplay — shows tap-to-play button
  const [needsTapToPlay, setNeedsTapToPlay] = useState(false);

  // Translation helper - gets text in selectedLanguage with fallback to global t()
  const tx = (key, options = {}) => t(key, { lng: selectedLanguage, ...options });

  // Restore from checkpoint on mount (user refreshed during pretest)
  useEffect(() => {
    const raw = sessionStorage.getItem("onboarding:checkpoint");
    if (raw) {
      try {
        const cp = JSON.parse(raw);
        _cachedName = cp.name;
        _cachedAge = String(cp.age);
        setPlayerName(cp.name);
        setPlayerAge(String(cp.age));
        setSelectedLanguage(cp.language);
        setPlayerData({ name: cp.name, age: cp.age, language: cp.language });
        setVideoAvailability(cp.videoAvailability);
        i18n.changeLanguage(cp.language);
        setStep("pretest");
      } catch { /* ignore corrupt checkpoint */ }
    }
  }, []);

  /**
   * Validates player form inputs
   * Checks: name is not empty and >= 2 chars, age is between 1-120
   * Sets error messages and returns validation status
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name - must not be empty and at least 2 characters
    if (!playerName.trim()) {
      newErrors.name = tx("playerOnboarding.nameErrorEmpty");
    } else if (playerName.trim().length < 2) {
      newErrors.name = tx("playerOnboarding.nameErrorShort");
    }
    
    // Validate age - must be provided and within 1-120 range
    if (!playerAge) {
      newErrors.age = tx("playerOnboarding.ageErrorEmpty");
    } else if (playerAge < 1 || playerAge > 120) {
      newErrors.age = tx("playerOnboarding.ageErrorInvalid");
    }
    
    // Update error state and return true if no errors
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Pre-test statements in selected language with fallback to English
  // Each statement has: id, text, correct (boolean)
  // Memoized to avoid recomputation on every render
  const statements = useMemo(
    () => statementsData[selectedLanguage] || statementsData.en || [],
    [selectedLanguage]
  );

  // Number of statements player must select correctly in pre-test
  // Counts total correct answers in Spanish version, defaults to 2 if none found
  // Used to validate pre-test quiz submission (player must select exactly this many)
  const requiredSelections = useMemo(() => {
    const spanishStatements = statementsData.es || [];
    const totalCorrect = spanishStatements.filter((statement) => statement.correct).length;
    return totalCorrect > 0 ? totalCorrect : 2;
  }, []);

  // Pre-test quiz translations with selectedLanguage
  const moderatorFormTitle = t("playerOnboarding.moderatorFormTitle");
  // Description shows required statement count (e.g., "Select 3 correct statements")
  const moderatorFormDescription = t("playerOnboarding.moderatorFormDescription", {
    lng: selectedLanguage,
    count: requiredSelections,
  });
  // Submit button text for pre-test form
  const moderatorFormSubmit = t("playerOnboarding.moderatorFormSubmit", { lng: selectedLanguage });
  // App name for header (ECHO, L'Échos, etc. depending on language)
  const appName = t("header.appName", { lng: selectedLanguage });

  /**
   * Builds absolute path to intro video file
   * @param {number} introNumber - which intro (1 or 2)
   * @param {string} language - language code (en, es, fi, sr)
   * @returns {string} Full asset path to video file
   */
  const getVideoPath = (introNumber, language) => assetPath(`/assets/intro${introNumber}_${language}.mp4`);

  /**
   * Asynchronously probes if a video file exists and is loadable
   * Creates temporary <video> element to load metadata with 2.5s timeout
   * Resolves to true if metadata loads, false on error or timeout
   * @param {string} path - Full URL to video file
   * @returns {Promise<boolean>} True if video is accessible, false otherwise
   */
  const checkVideoExists = async (path) => {
    // Check DOM availability (SSR safety)
    const canUseDom = typeof window !== "undefined" && typeof document !== "undefined";
    if (!canUseDom) return false;

    return new Promise((resolve) => {
      // Create temporary video element for metadata probing
      const probeVideo = document.createElement("video");
      let finished = false;

      // Cleanup and resolution helper - ensures only one result returned
      const finish = (result) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeoutId);
        probeVideo.removeAttribute("src");
        probeVideo.load();
        resolve(result);
      };

      // 5 second timeout — assume video exists if metadata is slow to load
      // (onError on the actual <video> element will catch truly missing files)
      const timeoutId = window.setTimeout(() => finish(true), 5000);

      // Metadata loaded successfully = video exists and is accessible
      probeVideo.preload = "metadata";
      probeVideo.onloadedmetadata = () => finish(true);
      // Any load error = video unavailable
      probeVideo.onerror = () => finish(false);
      probeVideo.src = path;
    });
  };

  // Save checkpoint so the pretest survives a page refresh
  const saveCheckpoint = (data, availability) => {
    sessionStorage.setItem("onboarding:checkpoint", JSON.stringify({
      name: data.name,
      age: data.age,
      language: data.language,
      videoAvailability: availability,
    }));
  };

  /**
   * Marks onboarding as complete and initializes game session
   * Stores player data, starts escape room timer, notifies app
   * @param {Object} data - Player profile data {name, age, language}
   */
  const completeOnboarding = (data) => {
    // Checkpoint no longer needed — onboarding is done
    sessionStorage.removeItem("onboarding:checkpoint");
    // Clear social login session for fresh game session
    sessionStorage.removeItem("socialLoginDone");

    // Create final player data object with onboarding completion flag
    const finalizedPlayerData = {
      ...data,
      onboardingCompleted: true,
    };

    // Store player data in session for game access
    sessionStorage.setItem("playerData", JSON.stringify(finalizedPlayerData));

    // Dispatch global event to notify other components onboarding is done
    window.dispatchEvent(new Event("onboardingComplete"));

    // Start the escape room countdown timer (player only has limited time)
    startEscapeTimer();

    // Call parent component callback with finalized player data
    onComplete(finalizedPlayerData);
  };

  /**
   * Toggle selection of pre-test statement
   * Allows deselecting, adds when under limit, prevents adding beyond required count
   * @param {string|number} id - Statement ID to toggle
   */
  const handleStatementClick = (id) => {
    setSelectedStatements((prev) => {
      // If already selected, remove it (toggle off)
      if (prev.includes(id)) {
        return prev.filter((statementId) => statementId !== id);
      }
      // If not at limit, add new selection
      if (prev.length < requiredSelections) {
        return [...prev, id];
      }
      // At limit - ignore attempts to add more
      return prev;
    });
  };

  /**
   * Handles pre-test quiz submission
   * Sends xAPI ANSWERED statement with correct/incorrect counts
   * Stores answers to session storage for later reference
   * Advances to intro2Video if available, otherwise completes onboarding
   */
  const handlePretestSubmit = () => {
    // Get full details of selected statements (map IDs to statement objects)
    const selectedDetails = statements
      .filter((statement) => selectedStatements.includes(statement.id))
      .map((statement) => ({
        id: statement.id,
        text: statement.text,
        correct: Boolean(statement.correct),
      }));
    
    // Count correct and incorrect selections for xAPI tracking
    const correctTrueCount = selectedDetails.filter((s) => s.correct).length;
    const correctFalseCount = selectedDetails.length - correctTrueCount;

    // Format response text with all selected statements (pipe-separated)
    const responseText = selectedDetails.map((s) => `${s.id}: ${s.text}`).join(" | ");

    // Send xAPI ANSWERED statement with detailed analytics
    sendStatement(
      XAPI_VERBS.ANSWERED,
      {
        id: `${ECHO_ACTIVITIES.INTRO.id}/pre-test`,
        definition: {
          name: { en: "Onboarding Pre-Test" },
          type: "http://adlnet.gov/expapi/activities/assessment",
          interactionType: "choice",
        },
      },
      {
        response: responseText,
        completion: true,
        // Custom extensions with answer details and correctness counts
        extensions: {
          "https://endgameproject.github.io/xapi/ext/onboardingPretestSelections": selectedDetails.map(
            (s) => ({
              id: s.id,
              text: s.text,
              correct: s.correct,
            })
          ),
          "https://endgameproject.github.io/xapi/ext/onboardingPretestCorrectTrueCount": correctTrueCount,
          "https://endgameproject.github.io/xapi/ext/onboardingPretestCorrectFalseCount": correctFalseCount,
        },
      },
      {
        contextActivities: {
          parent: [ECHO_ACTIVITIES.INTRO],
          grouping: [ECHO_ACTIVITIES.GAME],
        },
      }
    );

    // Store pre-test answers in session for game referencing
    sessionStorage.setItem(
      "onboardingCommunityNoteAnswers",
      JSON.stringify({
        language: selectedLanguage,
        selectedStatementIds: selectedStatements,
        selectedStatements: selectedDetails.map(({ id, text }) => ({ id, text })),
        submittedAt: new Date().toISOString(),
      })
    );

    // If intro2 video available, show it before completing
    if (videoAvailability.intro2) {
      setStep("intro2Video");
      return;
    }

    // Otherwise complete onboarding immediately
    completeOnboarding(playerData);
  };

  /**
   * Handles player form submission (name, age, language)
   * Validates form, initializes xAPI actor, starts game, checks video availability
   * Advances to intro1Video if available, otherwise jumps to pretest
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate name and age inputs
    if (validateForm()) {
      // Build player profile object from form inputs
      const nextPlayerData = {
        name: playerName.trim(),
        age: parseInt(playerAge),
        language: selectedLanguage,
      };

      // Save player data for use in later steps
      setPlayerData(nextPlayerData);

      // Switch app language ASAP to show UI in selected language
      i18n.changeLanguage(selectedLanguage);

      // Initialize xAPI actor (creates player profile for analytics)
      const initializedActor = initializeActor(nextPlayerData);

      // Send STARTED statement for game - only once per session
      if (!sessionStorage.getItem("echo:gameStarted")) {
        sessionStorage.setItem("echo:gameStarted", "1");
        sendStatement(
          XAPI_VERBS.STARTED,
          ECHO_ACTIVITIES.GAME,
          null,
          {
            contextActivities: {
              parent: [ECHO_ACTIVITIES.INTRO],
              grouping: [ECHO_ACTIVITIES.GAME],
            },
            // Include player age and language in game start tracking
            extensions: {
              [XAPI_EXTENSIONS.PLAYER_AGE]: parseInt(nextPlayerData.age, 10),
              [XAPI_EXTENSIONS.LANG]: nextPlayerData.language,
            },
          },
          initializedActor
        );
      }

      // Check availability of intro1 and intro2 videos in parallel
      const intro1Path = getVideoPath(1, selectedLanguage);
      const intro2Path = getVideoPath(2, selectedLanguage);
      const [hasIntro1, hasIntro2] = await Promise.all([
        checkVideoExists(intro1Path),
        checkVideoExists(intro2Path),
      ]);

      // Store availability status for conditional rendering
      const nextAvailability = { intro1: hasIntro1, intro2: hasIntro2 };
      setVideoAvailability(nextAvailability);
      setSelectedStatements([]);

      // Route to first available step: intro1 video -> pretest -> pretest (or exit)
      if (nextAvailability.intro1) {
        setStep("intro1Video");
      } else {
        // No intro1 video — go directly to pretest, save checkpoint
        saveCheckpoint(nextPlayerData, nextAvailability);
        setStep("pretest");
      }
    }
  };

  // Resolve full paths to intro videos
  const intro1Path = getVideoPath(1, selectedLanguage);
  const intro2Path = getVideoPath(2, selectedLanguage);

  // Refs for programmatic video playback (avoids muted autoplay restriction)
  const intro1VideoRef = useRef(null);
  const intro2VideoRef = useRef(null);

  // Conditional rendering checks - only show video if step AND video is available
  const isIntro1VideoStep = step === "intro1Video" && videoAvailability.intro1;
  const isIntro2VideoStep = step === "intro2Video" && videoAvailability.intro2;

  // Play intro videos programmatically — show tap-to-play button if browser blocks autoplay
  useEffect(() => {
    if (isIntro1VideoStep && intro1VideoRef.current) {
      setNeedsTapToPlay(false);
      intro1VideoRef.current.play().catch(() => setNeedsTapToPlay(true));
    }
  }, [isIntro1VideoStep]);

  useEffect(() => {
    if (isIntro2VideoStep && intro2VideoRef.current) {
      setNeedsTapToPlay(false);
      intro2VideoRef.current.play().catch(() => setNeedsTapToPlay(true));
    }
  }, [isIntro2VideoStep]);

  // Intro 1 video - plays first introduction video, advances to pretest when ends or errors
  if (isIntro1VideoStep) {
    return (
      <div className="onboarding-overlay onboarding-overlay-video">
        {/* Full-screen video player for intro sequence */}
        <video
          ref={intro1VideoRef}
          className="onboarding-video-fullscreen"
          src={intro1Path}
          playsInline
          controls={false}
          webkit-playsinline="true"
          onEnded={() => { saveCheckpoint(playerData, videoAvailability); setStep("pretest"); }}
          onError={() => { saveCheckpoint(playerData, videoAvailability); setStep("pretest"); }}
        />
        {needsTapToPlay && (
          <button
            className="onboarding-tap-to-play"
            onClick={() => {
              setNeedsTapToPlay(false);
              intro1VideoRef.current?.play().catch(() => {});
            }}
          >
            ▶
          </button>
        )}
      </div>
    );
  }

  // Intro 2 video - plays second introduction video, completes onboarding when ends or errors
  if (isIntro2VideoStep) {
    return (
      <div className="onboarding-overlay onboarding-overlay-video">
        {/* Full-screen video player for second intro sequence */}
        <video
          ref={intro2VideoRef}
          className="onboarding-video-fullscreen"
          src={intro2Path}
          playsInline
          controls={false}
          webkit-playsinline="true"
          onEnded={() => completeOnboarding(playerData)}
          onError={() => completeOnboarding(playerData)}
        />
        {needsTapToPlay && (
          <button
            className="onboarding-tap-to-play"
            onClick={() => {
              setNeedsTapToPlay(false);
              intro2VideoRef.current?.play().catch(() => {});
            }}
          >
            ▶
          </button>
        )}
      </div>
    );
  }

  // Main onboarding form view with conditional rendering
  return (
    <div className="onboarding-overlay">
      {/* Container with dynamic width - wider for pretest with many statements */}
      <div className={`onboarding-container ${step === "pretest" ? "onboarding-container--wide" : ""}`}>
        {/* Player form step - name, age, language selection */}
        {step === "playerForm" && (
          <>
            {/* Header with app name and subtitle */}
            <div className="onboarding-header">
              <h1 className="onboarding-title">{appName}</h1>
              <p className="onboarding-subtitle">{tx("playerOnboarding.subtitle")}</p>
            </div>

            {/* Profile form - collects player name, age, language */}
            <form className="onboarding-form" onSubmit={handleSubmit}>
              {/* Name input field */}
              <div className="onboarding-field">
                <label htmlFor="playerName" className="onboarding-label">
                  {tx("playerOnboarding.nameLabel")}
                </label>
                <input
                  id="playerName"
                  type="text"
                  // Apply error styling if name validation failed
                  className={`onboarding-input ${errors.name ? "error" : ""}`}
                  value={playerName}
                  onChange={(e) => { _cachedName = e.target.value; setPlayerName(e.target.value); }}
                  placeholder={tx("playerOnboarding.namePlaceholder")}
                  maxLength={30}
                  autoComplete="off"
                />
                {/* Show validation error message if errors exist */}
                {errors.name && <span className="onboarding-error">{errors.name}</span>}
              </div>

              {/* Age input field */}
              <div className="onboarding-field">
                <label htmlFor="playerAge" className="onboarding-label">
                  {tx("playerOnboarding.ageLabel")}
                </label>
                <input
                  id="playerAge"
                  type="number"
                  // Apply error styling if age validation failed
                  className={`onboarding-input ${errors.age ? "error" : ""}`}
                  value={playerAge}
                  onChange={(e) => { _cachedAge = e.target.value; setPlayerAge(e.target.value); }}
                  placeholder={tx("playerOnboarding.agePlaceholder")}
                  min="1"
                  max="120"
                  autoComplete="off"
                />
                {/* Show validation error message if errors exist */}
                {errors.age && <span className="onboarding-error">{errors.age}</span>}
              </div>
              {/* Language selection grid - shown only if multiple languages configured */}
              {i18n.options.supportedLngs && i18n.options.supportedLngs.length > 0 && (
              <div className="onboarding-field">
                <label className="onboarding-label">{tx("playerOnboarding.languageLabel")}</label>
                {/* Grid of language options with country flags */}
                <div className="language-grid">
                  {/* Spanish language button with ES flag */}
                  {i18n.options.supportedLngs.includes("es") && <button
                    type="button"
                    // Highlight selected language
                    className={`language-option ${selectedLanguage === "es" ? "selected" : ""}`}
                    onClick={() => setSelectedLanguage("es")}
                  >
                    <img src="https://flagcdn.com/w80/es.png" alt="ES" className="language-flag" />
                    <span className="language-name">Español</span>
                  </button>}
                  
                  {/* English language button with GB flag */}
                  {i18n.options.supportedLngs.includes("en") && <button
                    type="button"
                    // Highlight selected language
                    className={`language-option ${selectedLanguage === "en" ? "selected" : ""}`}
                    onClick={() => setSelectedLanguage("en")}
                  >
                    <img src="https://flagcdn.com/w80/gb.png" alt="GB" className="language-flag" />
                    <span className="language-name">English</span>
                  </button>}
                  
                  {/* Finnish language button with FI flag */}
                  {i18n.options.supportedLngs.includes("fi") && <button
                    type="button"
                    // Highlight selected language
                    className={`language-option ${selectedLanguage === "fi" ? "selected" : ""}`}
                    onClick={() => setSelectedLanguage("fi")}
                  >
                    <img src="https://flagcdn.com/w80/fi.png" alt="FI" className="language-flag" />
                    <span className="language-name">Suomi</span>
                  </button>}
                  
                  {/* Serbian language button with RS flag */}
                  {i18n.options.supportedLngs.includes("sr") && <button
                    type="button"
                    // Highlight selected language
                    className={`language-option ${selectedLanguage === "sr" ? "selected" : ""}`}
                    onClick={() => setSelectedLanguage("sr")}
                  >
                    <img src="https://flagcdn.com/w80/rs.png" alt="RS" className="language-flag" />
                    <span className="language-name">Српски</span>
                  </button>}
                </div>
              </div>)}

              {/* Submit button to proceed to next step */}
              <button type="submit" className="onboarding-submit">
                {tx("playerOnboarding.submitButton")}
              </button>
            </form>
          </>
        )}

        {/* Pre-test quiz step - player selects required number of correct statements */}
        {step === "pretest" && (
          <div className="onboarding-step-content">
            {/* Quiz title and instructions */}
            <h2 className="onboarding-step-title">{moderatorFormTitle}</h2>
            <p className="onboarding-subtitle">{moderatorFormDescription}</p>

            {/* Progress counter showing selected/required statements */}
            <div className="onboarding-counter">
              {selectedStatements.length}/{requiredSelections} {tx("playerOnboarding.pretestCounter")}
            </div>

            {/* List of true/false statements to select from */}
            <div className="onboarding-statements-list">
              {statements.map((statement) => {
                // Check if this statement is currently selected
                const isSelected = selectedStatements.includes(statement.id);
                return (
                  <button
                    key={statement.id}
                    type="button"
                    // Highlight button when selected
                    className={`onboarding-statement ${isSelected ? "selected" : ""}`}
                    onClick={() => handleStatementClick(statement.id)}
                  >
                    {/* Checkmark appears when statement is selected */}
                    <span className="onboarding-statement-check">{isSelected ? "✓" : ""}</span>
                    <span>{statement.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit button - only enabled when required number selected */}
            <button
              type="button"
              className="onboarding-submit"
              onClick={handlePretestSubmit}
              // Disable until exactly required number of statements are selected
              disabled={selectedStatements.length !== requiredSelections}
            >
              {moderatorFormSubmit}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
