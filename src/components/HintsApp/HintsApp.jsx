import React, { useState, useMemo } from "react";
import "./HintsApp.css";
import { useOS } from "../../contexts/OSProvider";
import { useStats } from "../../contexts/StatsProvider";
import { useTranslation } from "react-i18next";
import { FaTimes, FaMinus, FaLightbulb, FaChevronLeft, FaPlay } from "react-icons/fa";
import hintsDataRaw from "./HintsData.json";
import { useXAPI, XAPI_VERBS } from "../../contexts/XAPIProvider";
import { assetPath } from "../../utils/assetPath";

/**
 * HintsApp – App de pistas del escape room.
 * Muestra las pistas correspondientes al reto actual del jugador.
 */
export const HintsApp = () => {
  const { closeApp, minimizeApp } = useOS();
  const {
    challenge1Completed,
    challenge2Completed,
    challenge3Completed,
  } = useStats();
  const { t, i18n } = useTranslation();

  const [selectedContext, setSelectedContext] = useState(null);
  const [showIntroVideo, setShowIntroVideo] = useState(null); // null | 1 | 2

  // Determina el puzzle_id activo según el avance del jugador
  const currentPuzzleId = useMemo(() => {
    if (!challenge1Completed) return "1";
    if (!challenge2Completed) return "2";
    if (!challenge3Completed) return "3";
    return "4";
  }, [challenge1Completed, challenge2Completed, challenge3Completed]);

  const lang = i18n.language?.slice(0, 2) || "en";
  const langHints = hintsDataRaw[lang] ?? hintsDataRaw["en"] ?? {};
  const currentHints = langHints[currentPuzzleId] ?? [];

  const handleClose = () => closeApp("hints");
  const handleMinimize = () => minimizeApp();

  const { sendStatement } = useXAPI();

  const trackHintAsked = async (puzzleId, hintIdx, hintTitle) => {
    await sendStatement(
      XAPI_VERBS.ASKED,
      {
        id: `https://endgameproject.github.io/xapi/escape-rooms/echo/objects/hint-${puzzleId}-${hintIdx + 1}`,
        definition: {
          name: { en: `Hint: ${hintTitle}` },
          type: "https://xapi.elearn.rwth-aachen.de/definitions/generic/activities/tip",
        },
      },
      null,
      {
        contextActivities: {
          parent: [
            {
              id: `https://endgameproject.github.io/xapi/escape-rooms/echo/rooms/puzzle-${puzzleId}`,
              definition: { name: { en: `Puzzle ${puzzleId}` } },
            },
          ],
          grouping: [
            {
              id: "https://endgameproject.github.io/xapi/escape-rooms/echo",
              definition: { name: { en: "ECHO" } },
            },
          ],
        },
      }
    );
  };

  const introVideoSrc = showIntroVideo
    ? assetPath(`/assets/intro${showIntroVideo}_${lang}.mp4`)
    : null;

  if (showIntroVideo) {
    return (
      <div className="hints-intro-overlay">
        <video
          className="hints-intro-video"
          src={introVideoSrc}
          autoPlay
          playsInline
          onEnded={() => {
            if (showIntroVideo === 1) {
              setShowIntroVideo(2);
            } else {
              setShowIntroVideo(null);
            }
          }}
          onError={() => setShowIntroVideo(null)}
        />
        <button
          className="hints-intro-skip"
          onClick={() => setShowIntroVideo(null)}
        >
          {t("hintsApp.skipVideo", "Skip")} →
        </button>
      </div>
    );
  }

  return (
    <div className="hints-app-backdrop" onClick={handleClose}>
    <div className="hints-app-window" onClick={(e) => e.stopPropagation()}>
      {/* Title bar */}
      <div className="hints-titlebar">
        <div className="hints-window-title">
          <FaLightbulb className="hints-title-icon" />
          <span>{t("hintsApp.title")}</span>
        </div>
        <div className="hints-window-controls">
          <button
            className="window-control minimize"
            onClick={handleMinimize}
            title={t("desktop.window.minimize")}
            aria-label={t("desktop.window.minimize")}
          >
            <FaMinus />
          </button>
          <button
            className="window-control close"
            onClick={handleClose}
            title={t("desktop.window.close")}
            aria-label={t("desktop.window.close")}
          >
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Puzzle label */}
      <div className="hints-puzzle-badge">
        {t(`hintsApp.puzzle.${currentPuzzleId}`)}
      </div>

      {/* Body */}
      <div className="hints-body">
        {currentHints.length === 0 ? (
          <div className="hints-empty">
            <FaLightbulb className="hints-empty-icon" />
            <p>{t("hintsApp.noHints")}</p>
          </div>
        ) : selectedContext === null ? (
          // Context list
          <>
            <p className="hints-prompt">{t("hintsApp.selectContext")}</p>
            <ul className="hints-context-list">
              {currentHints.map((hint, idx) => (
                <li key={idx}>
                  <button
                    className="hints-context-btn"
                    onClick={() => {
                      trackHintAsked(currentPuzzleId, idx, hint.context);
                      setSelectedContext(idx);
                    }}
                  >
                    <FaLightbulb className="hints-context-icon" />
                    <span>{hint.context}</span>
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          // Clue detail
          <div className="hints-clue-view">
            <button
              className="hints-back-btn"
              onClick={() => setSelectedContext(null)}
            >
              <FaChevronLeft />
              {t("hintsApp.back")}
            </button>
            <div className="hints-clue-context">
              {currentHints[selectedContext].context}
            </div>
            <div className="hints-clue-box">
              <FaLightbulb className="hints-clue-icon" />
              <p>{currentHints[selectedContext].clue}</p>
            </div>
          </div>
        )}

        <button
          className="hints-rewatch-btn"
          onClick={() => setShowIntroVideo(1)}
        >
          <FaPlay className="hints-rewatch-icon" />
          {t("hintsApp.rewatchIntro", "Rewatch intro video")}
        </button>
      </div>
    </div>
    </div>
  );
};
