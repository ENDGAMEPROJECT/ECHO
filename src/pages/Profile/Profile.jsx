import "./Profile.css";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { usePosts } from "../../contexts/PostsProvider.jsx";
import { Post } from "../../components/Post/Post";
import { UserInfo } from "./components/UserInfo/UserInfo";
import { Navbar } from "../../components/Navbar/Navbar";
import {
  useXAPI,
  XAPI_VERBS,
  ECHO_ACTIVITIES,
} from "../../contexts/XAPIProvider.jsx";
import { useUser } from "../../contexts/UserProvider.jsx";
import { StatsPanel } from "../../components/StatsPanel/StatsPanel";
import { getLocalizedContent } from "../../utils/i18nHelpers.jsx";

const CLASSIFICATION = {
  YES: "yes",
  NO: "no",
};

const normalizeClassification = (value) => {
  if (value === "AI") return CLASSIFICATION.YES;
  if (value === "Humano") return CLASSIFICATION.NO;
  return value;
};

const expectedClassificationFromIsBot = (isBot) =>
  isBot ? CLASSIFICATION.YES : CLASSIFICATION.NO;

const requiresQuizSubmission = (classification, user) =>
  normalizeClassification(classification) === CLASSIFICATION.YES &&
  user?.puzzle?.isBot === true;

const QUIZ_INDICATOR_KEYS = [
  "abnormalRatio",
  "recentAccount",
  "temporalActivity",
  "targetAudience",
  "emotions",
];

export const Profile = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [fromAdmin, setFromAdmin] = useState(false);
  const [showClassificationQuiz, setShowClassificationQuiz] = useState(false);
  const [quizSubmittedByUser, setQuizSubmittedByUser] = useState(() => {
    const saved = sessionStorage.getItem("adminGameQuizState");
    if (!saved) return {};

    try {
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  });
  const [selectedQuizOptions, setSelectedQuizOptions] = useState([]);
  const [highlightedPostId, setHighlightedPostId] = useState(null);
  const [classifiedUsers, setClassifiedUsers] = useState(() => {
    const saved = sessionStorage.getItem("adminGameState");
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return Object.fromEntries(
      Object.entries(parsed).map(([uname, classification]) => [
        uname,
        normalizeClassification(classification),
      ]),
    );
  });
  const { sendStatement, trackQuizAnswered } = useXAPI();
  const lookedAtSentRef = useRef(new Set());
  const { userState } = useUser();

  const { allPosts, postLoading } = usePosts();
  const { username } = useParams();

  const [expandedHints, setExpandedHints] = useState({});
  const toggleDescription = (optionKey) => {
    setExpandedHints((prev) => ({
      ...prev,
      [optionKey]: !prev[optionKey],
    }));
  };

  useEffect(() => {
    if (lookedAtSentRef.current.has(username)) return;
    lookedAtSentRef.current.add(username);
    sendStatement(
      XAPI_VERBS.LOOKED_AT,
      {
        id: `${ECHO_ACTIVITIES.PROFILE.id}/${username}`,
        definition: {
          name: { en: `Account: ${username}` },
          type: "http://adlnet.gov/expapi/activities/profile",
        },
      },
      null,
      {
        contextActivities: {
          grouping: [ECHO_ACTIVITIES.GAME],
        },
      },
    );
  }, [username]);

  const postsByUser = allPosts?.filter((post) => post.username === username);
  const currentUser = userState?.allUsers?.find((u) => u.username === username);
  const suspectUsernames = (() => {
    const raw = sessionStorage.getItem("adminGameUsernames");
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  })();
  const isSuspectUser =
    Boolean(currentUser) && suspectUsernames.includes(username);

  const sortedPostsByUser = postsByUser
    ? [
        ...postsByUser.filter((p) => p.isCommunityNote),
        ...postsByUser
          .filter((p) => !p.isCommunityNote)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
      ]
    : [];

  const isClassificationLocked = (() => {
    if (!currentUser) return false;
    const currentClassification = normalizeClassification(
      classifiedUsers[username],
    );
    if (!currentClassification) return false;
    const isBot = currentUser?.puzzle?.isBot;
    return currentClassification === expectedClassificationFromIsBot(isBot);
  })();

  useEffect(() => {
    const cameFromAdmin = sessionStorage.getItem("fromAdmin");
    setFromAdmin(cameFromAdmin === "true");
  }, []);

  const handleBackToGame = () => {
    sessionStorage.removeItem("fromAdmin");
    navigate("/admin");
  };

  const handleClassification = (classification) => {
    if (!currentUser) return;
    if (isClassificationLocked) return;

    const normalizedClassification = normalizeClassification(classification);
    const isBot = currentUser?.puzzle?.isBot;
    const expectedClassification = expectedClassificationFromIsBot(isBot);
    const isCorrect = normalizedClassification === expectedClassification;

    sendStatement(
      XAPI_VERBS.ATTEMPTED,
      {
        id: `${ECHO_ACTIVITIES.PUZZLE_1.id}/account/${currentUser?.username}`,
        definition: {
          name: { en: `Account Classification: ${currentUser?.username}` },
          type: "http://adlnet.gov/expapi/activities/cmi.interaction",
          interactionType: "choice",
          choices: [
            { id: "yes", description: { en: "Yes" } },
            { id: "no", description: { en: "No" } },
          ],
          correctResponsesPattern: [expectedClassification],
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
        response: normalizedClassification,
      },
      {
        contextActivities: {
          parent: [ECHO_ACTIVITIES.PUZZLE_1],
          grouping: [ECHO_ACTIVITIES.GAME],
        },
      },
    );

    setClassifiedUsers((prev) => {
      const newState = {
        ...prev,
        [currentUser.username]: normalizedClassification,
      };
      sessionStorage.setItem("adminGameState", JSON.stringify(newState));
      return newState;
    });

    const shouldRequireQuiz = requiresQuizSubmission(
      normalizedClassification,
      currentUser,
    );
    if (shouldRequireQuiz && !quizSubmittedByUser[currentUser.username]) {
      setShowClassificationQuiz(true);
      return;
    }

    setShowClassificationQuiz(false);
  };

  const toggleQuizOption = (optionKey) => {
    setSelectedQuizOptions((prev) => {
      if (prev.includes(optionKey)) {
        return prev.filter((id) => id !== optionKey);
      }
      return [...prev, optionKey];
    });
  };

  const handleSubmitQuiz = () => {
    if (!currentUser) return;

    // Obtener los indicadores seleccionados por el usuario (convertir índices a nombres)
    const selectedIndicators = selectedQuizOptions.filter(Boolean);

    // Obtener los indicadores correctos (los que son true en puzzle)
    const correctIndicators = QUIZ_INDICATOR_KEYS.filter(
      (key) => currentUser?.puzzle?.[key] === true,
    );

    // Enviar statement xAPI con el verbo "answered" al completar el test
    trackQuizAnswered(
      currentUser.username,
      selectedIndicators,
      correctIndicators,
    );

    setQuizSubmittedByUser((prev) => {
      const newState = { ...prev, [currentUser.username]: true };
      sessionStorage.setItem("adminGameQuizState", JSON.stringify(newState));
      return newState;
    });
    setShowClassificationQuiz(false);
  };

  const currentClassification = normalizeClassification(
    classifiedUsers[username],
  );
  const hasClassificationForCurrentProfile = Boolean(currentClassification);
  const expectedClassificationForCurrentProfile =
    expectedClassificationFromIsBot(currentUser?.puzzle?.isBot);
  const isClassificationCorrectForCurrentProfile =
    Boolean(currentUser) &&
    hasClassificationForCurrentProfile &&
    currentClassification === expectedClassificationForCurrentProfile;
  const shouldRequireQuizForCurrentProfile = requiresQuizSubmission(
    currentClassification,
    currentUser,
  );
  const isPuzzleProfile = fromAdmin && isSuspectUser && username !== "ECHO";
  const isQuizCompletedForCurrentProfile = Boolean(
    currentUser && quizSubmittedByUser[currentUser.username],
  );
  const isCurrentProfileResolved =
    isClassificationCorrectForCurrentProfile &&
    (!shouldRequireQuizForCurrentProfile || isQuizCompletedForCurrentProfile);
  const canReturnToGame = true;

  const canOpenQuiz =
    shouldRequireQuizForCurrentProfile &&
    currentUser &&
    !quizSubmittedByUser[currentUser.username];
  const shouldLockGlobalNavigation = isPuzzleProfile && !canReturnToGame;

  useEffect(() => {
    setSelectedQuizOptions([]);
  }, [username]);

  useEffect(() => {
    if (username !== "ECHO") {
      setHighlightedPostId(null);
      return;
    }

    const shouldHighlight =
      sessionStorage.getItem("echo:highlightFinalCommunityNote") === "true";
    const highlightedCreatedAt = sessionStorage.getItem(
      "echo:highlightFinalCommunityNoteCreatedAt",
    );
    const highlightedContent = sessionStorage.getItem(
      "echo:highlightFinalCommunityNoteContent",
    );
    if (!shouldHighlight || !sortedPostsByUser.length) return;

    const postToHighlight = sortedPostsByUser.find(
      (post) =>
        post.isCommunityNote &&
        String(post.createdAt) === String(highlightedCreatedAt) &&
        String(getLocalizedContent(post.content, i18n.language)) ===
          String(highlightedContent),
    );
    if (!postToHighlight?._id) {
      setHighlightedPostId(null);
      return;
    }

    setHighlightedPostId(postToHighlight._id);
    sessionStorage.removeItem("echo:highlightFinalCommunityNote");
    sessionStorage.removeItem("echo:highlightFinalCommunityNoteCreatedAt");
    sessionStorage.removeItem("echo:highlightFinalCommunityNoteContent");

    const timeoutId = setTimeout(() => {
      setHighlightedPostId(null);
    }, 2800);

    return () => clearTimeout(timeoutId);
  }, [i18n.language, sortedPostsByUser, username]);

  return (
    <>
      <div className="app-container">
        <div
          className={shouldLockGlobalNavigation ? "profile-navbar-locked" : ""}
        >
          <Navbar />
        </div>

        <main className="feed profile-feed">
          {fromAdmin && (
            <div className="back-to-game-container">
              <button
                className="back-to-game-button"
                onClick={handleBackToGame}
                disabled={!canReturnToGame}
              >
                ← {t("profile.backToGame")}
              </button>
            </div>
          )}
          <UserInfo
            username={username}
            showClassificationControls={
              fromAdmin && isSuspectUser && username !== "ECHO"
            }
            selectedClassification={classifiedUsers[username]}
            onClassify={handleClassification}
            isClassificationLocked={isClassificationLocked}
            canOpenClassificationQuiz={canOpenQuiz}
            onOpenClassificationQuiz={() => setShowClassificationQuiz(true)}
          />
          <div className="user-posts-container">
            {!postLoading &&
              (sortedPostsByUser.length ? (
                sortedPostsByUser.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    shouldFlash={post._id === highlightedPostId}
                  />
                ))
              ) : (
                <>
                  <p className="no-bookmarks">{t("profile.noPosts")}</p>
                </>
              ))}
          </div>

          {showClassificationQuiz && (
            <div
              className="classification-quiz-overlay"
              onClick={() => setShowClassificationQuiz(false)}
            >
              <div
                className="classification-quiz-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="classification-quiz-close"
                  type="button"
                  onClick={() => setShowClassificationQuiz(false)}
                  aria-label={t("profile.closeQuiz")}
                >
                  ×
                </button>
                <h3 className="classification-quiz-title">
                  {t("profile.classificationQuizTitle")}
                </h3>
                <p className="classification-quiz-subtitle">
                  {t("profile.classificationQuizSubtitle")}
                </p>

                <div className="classification-quiz-options">
                  {QUIZ_INDICATOR_KEYS.map((optionKey) => (
                    <label
                      key={optionKey}
                      className="classification-quiz-option"
                    >
                      <input
                        type="checkbox"
                        checked={selectedQuizOptions.includes(optionKey)}
                        onChange={() => toggleQuizOption(optionKey)}
                      />

                      <div>
                        <strong>
                          {t(`admin.hintContent.${optionKey}`).split(":")[0]}
                        </strong>
                        <button
                          type="button"
                          onClick={() => toggleDescription(optionKey)}
                          className="hint-toggle-button"
                        >
                          {expandedHints[optionKey]
                            ? "Ver menos"
                            : "Ver más"}
                        </button>
                        <br></br>
                        <span
                          style={{
                            color: "#ffffffbb",
                            fontSize: "0.85rem",
                            marginTop: "0.25rem",
                          
                            display: expandedHints[optionKey] ? "inline" : "none",
                          }}
                        >
                          {t(`admin.hintContent.${optionKey}`).split(":")[1]}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>

                <button
                  type="button"
                  className="classification-quiz-submit"
                  onClick={handleSubmitQuiz}
                >
                  {t("profile.sendQuizAnswer")}
                </button>
              </div>
            </div>
          )}
        </main>
        {/* Panel de estadísticas lateral */}
        <aside className="stats-sidebar">
          <StatsPanel />
        </aside>
      </div>
    </>
  );
};
