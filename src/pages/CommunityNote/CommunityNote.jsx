import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useStats } from "../../contexts/StatsProvider.jsx";
import { usePosts } from "../../contexts/PostsProvider.jsx";
import { useLoggedInUser } from "../../contexts/LoggedInUserProvider.jsx";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "../../contexts/XAPIProvider.jsx";
import { IoMdClose } from "../../utils/icons.jsx";
import statementsData from "./CommunityNoteStatements.json";
import { assetPath } from "../../utils/assetPath";
import "./CommunityNote.css";

const toMinutesSecondsLabel = (durationMs) => {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}min${String(seconds).padStart(2, "0")}seg`;
};

export const CommunityNote = ({ setIsCreateNewPostClicked, className = "modal-content" }) => {
  const { t } = useTranslation();
  const currentLang = t("langKey");
  const { completeChallengeFinal } = useStats();
  const { createPost } = usePosts();
  const { loggedInUserState } = useLoggedInUser();
  const { trackChallengeStarted, sendStatement } = useXAPI();
  const navigate = useNavigate();
  const [selectedStatements, setSelectedStatements] = useState([]);

  // Fallback: asegurar que el timer empieza aunque el modal se abra sin pasar por NewPostLauncher
  useEffect(() => {
    if (!sessionStorage.getItem('echo:challengeStart:4')) {
      trackChallengeStarted('4', 'Puzzle 4 - Community Note');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statements = useMemo(
    () => (statementsData[currentLang] || statementsData.en || []).sort(() => Math.random() - 0.5),
    [currentLang]
  );
  const requiredCorrectCount = useMemo(
    () => statements.filter((statement) => statement.correct).length,
    [statements]
  );
  const challengeDescription = useMemo(
    () => t("createPost.selectCorrectCount", { count: requiredCorrectCount }),
    [t, requiredCorrectCount]
  );

  useEffect(() => {
    // Keep only valid ids for the active language and enforce the current cap.
    const validIds = new Set(statements.map((statement) => statement.id));
    setSelectedStatements((prev) => {
      const filtered = prev.filter((id) => validIds.has(id));
      return filtered.slice(0, requiredCorrectCount);
    });
  }, [statements, requiredCorrectCount]);

  const handleStatementClick = (id) => {
    setSelectedStatements((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter((statementId) => statementId !== id);
      }
      if (prev.length < requiredCorrectCount) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const handleSubmit = () => {
    if (selectedStatements.length !== requiredCorrectCount) {
      toast.error(
        t("createPost.incorrectSelection") + ` (${selectedStatements.length}/${requiredCorrectCount})`
      );
      return;
    }

    const correctSelections = selectedStatements.every((id) => {
      const statement = statements.find((s) => s.id === id);
      return statement.correct;
    });

    if (!correctSelections) {
      // failed: frases incorrectas seleccionadas
      const selectedStatementsData = selectedStatements.map((id) => {
        const s = statements.find((st) => st.id === id);
        return s;
      });

      const correctCount = selectedStatementsData.filter((s) => s.correct).length;
      const incorrectCount = selectedStatementsData.filter((s) => !s.correct).length;

      const responseString = statements
        .map((stmt, index) => `${index + 1}: ${stmt.text}`)
        .join(' | ');

      sendStatement(
        XAPI_VERBS.FAILED,
        ECHO_ACTIVITIES.FINAL,
        {
          completion: false,
          response: responseString,
          extensions: {
            "https://endgameproject.github.io/xapi/ext/communityNoteSelections": selectedStatementsData.map((s) => ({
              id: s.id,
              text: s.text,
              correct: s.correct,
            })),
            "https://endgameproject.github.io/xapi/ext/communityNoteCorrectCount": correctCount,
            "https://endgameproject.github.io/xapi/ext/communityNoteIncorrectCount": incorrectCount,
          },
        },
        {
          contextActivities: {
            parent: [ECHO_ACTIVITIES.FINAL],
            grouping: [ECHO_ACTIVITIES.GAME],
          },
        }
      );
      toast.error(t("createPost.incorrectSelection"));
      setSelectedStatements([]);
      return;
    }

    const finalCommunityNoteCreatedAt = new Date().toISOString();
    const conclusionPost = {
      firstName: loggedInUserState?.firstName,
      lastName: loggedInUserState?.lastName,
      content: t("createPost.conclusionText"),
      mediaUrl: "",
      isCommunityNote: true,
      avatarURL: "/assets/echo-logo-bg.png",
      createdAt: finalCommunityNoteCreatedAt,
    };

    createPost(new Event("submit"), conclusionPost, "admin-token");
    completeChallengeFinal();

    // Guard dedup
    const completedKey4 = 'echo:challengeCompleted:4';
    if (!sessionStorage.getItem(completedKey4)) {
      sessionStorage.setItem(completedKey4, '1');

      const context4 = {
        contextActivities: {
          parent: [ECHO_ACTIVITIES.FINAL],
          grouping: [ECHO_ACTIVITIES.GAME],
        },
      };

      // succeeded: resolución correcta
      sendStatement(
        XAPI_VERBS.SUCCEEDED,
        ECHO_ACTIVITIES.FINAL,
        { success: true, completion: true },
        context4
      );

      // completed: duración desde que se inició el reto
      const startRaw4 = sessionStorage.getItem('echo:challengeStart:4');
      const completedResult4 = { completion: true };
      if (startRaw4 && Number.isFinite(Number(startRaw4))) {
        const durationMs4 = Date.now() - Number(startRaw4);
        completedResult4.duration = toMinutesSecondsLabel(durationMs4);
        completedResult4.extensions = { "https://endgameproject.github.io/xapi/ext/durationMs": durationMs4 };
      }
      sessionStorage.removeItem('echo:challengeStart:4');
      sendStatement(XAPI_VERBS.COMPLETED, ECHO_ACTIVITIES.FINAL, completedResult4, context4);

      // Send COMPLETED statement for the entire ECHO GAME with total duration
      const escapeTimerStartedAt = sessionStorage.getItem('escapeTimerStartedAt');
      const gameCompletedResult = { 
        completion: true,
        success: true,
      };
      if (escapeTimerStartedAt && Number.isFinite(Number(escapeTimerStartedAt))) {
        const totalDurationMs = Date.now() - Number(escapeTimerStartedAt);
        gameCompletedResult.duration = toMinutesSecondsLabel(totalDurationMs);
        gameCompletedResult.extensions = { "https://endgameproject.github.io/xapi/ext/durationMs": totalDurationMs };
      }
      sendStatement(
        XAPI_VERBS.COMPLETED,
        ECHO_ACTIVITIES.GAME,
        gameCompletedResult,
        {
          contextActivities: {
            grouping: [ECHO_ACTIVITIES.GAME],
          },
        }
      );
    }
    sessionStorage.setItem("echo:highlightFinalCommunityNote", "true");
    sessionStorage.setItem("echo:highlightFinalCommunityNoteCreatedAt", finalCommunityNoteCreatedAt);
    sessionStorage.setItem("echo:highlightFinalCommunityNoteContent", t("createPost.conclusionText"));
    setIsCreateNewPostClicked && setIsCreateNewPostClicked(false);
    navigate(`/profile/${loggedInUserState?.username || "Katherine"}`);
  };

  return (
    <form className={`new-post-container conclusion-challenge-form ${className}`} onSubmit={(e) => e.preventDefault()}>
      <div
        onClick={() => navigate(`/profile/${loggedInUserState?.username}`)}
        className="img-container"
      >
        <img
         className="echo-logo-create-post"
          src={assetPath(loggedInUserState.avatarURL)}
          alt={loggedInUserState.firstName}
        />
      </div>

      <div className="input-container">
        {setIsCreateNewPostClicked && (
          <IoMdClose
            onClick={() => setIsCreateNewPostClicked(false)}
            className="close-create-post-modal challenge-close-btn"
          />
        )}
        <div className="challenge-content">
          <div className="cn-header">
            <div className="cn-header-top">
              <span className="cn-badge">📋 Community Note</span>
              <span className={`cn-counter${selectedStatements.length === requiredCorrectCount ? " ready" : ""}`}>
                {selectedStatements.length}/{requiredCorrectCount} {t("createPost.selected")}
              </span>
            </div>
            <p className="challenge-description">{challengeDescription}</p>
          </div>

          <div className="statements-list">
            {statements.map((statement) => (
              <div
                key={statement.id}
                className={`statement-option ${
                  selectedStatements.includes(statement.id) ? "selected" : ""
                }`}
                onClick={() => handleStatementClick(statement.id)}
                role="checkbox"
                aria-checked={selectedStatements.includes(statement.id)}
              >
                <div className="statement-check">
                  {selectedStatements.includes(statement.id) && (
                    <span className="check">✓</span>
                  )}
                </div>
                <p className="statement-text">{statement.text}</p>
              </div>
            ))}
          </div>

          <div className="cn-footer">
            <div className="post-btn-container">
              <button
                onClick={handleSubmit}
                disabled={selectedStatements.length !== requiredCorrectCount}
                type="button"
              >
                {t("createPost.publishConclusion")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
