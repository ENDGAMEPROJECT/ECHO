import React, { useState, useEffect, useRef } from "react";
import "./StatsPanel.css";
import { useStats } from "../../contexts/StatsProvider";
import { useTranslation } from "react-i18next";
import {
  FaRobot,
  FaBrain,
  FaFlag,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

/* ── SVG: semicírculo gauge ────────────────────────────── */
const HalfGauge = ({ value, colorClass }) => {
  const r = 28;
  const arc = Math.PI * r;
  const filled = Math.min(value / 100, 1) * arc;
  return (
    <svg width="80" height="46" viewBox="0 0 80 46" className={`sp-gauge-svg ${colorClass}`}>
      <path
        d="M 8 40 A 32 32 0 0 1 72 40"
        fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round"
      />
      <path
        d="M 8 40 A 32 32 0 0 1 72 40"
        fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round"
        strokeDasharray={`${filled} ${arc}`}
        className="sp-gauge-arc"
      />
      <text x="40" y="38" textAnchor="middle" fill="currentColor"
        fontSize="13" fontWeight="700" fontFamily='"Share Tech Mono", monospace'>
        {value}%
      </text>
    </svg>
  );
};

/* ── SVG: anillo donut ─────────────────────────────────── */
const DonutChart = ({ pct, colorClass, label, size = 62 }) => {
  const r = 19;
  const circ = 2 * Math.PI * r;
  const filled = Math.min(pct / 100, 1) * circ;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={colorClass}>
      <circle cx="24" cy="24" r={r} fill="none"
        stroke="rgba(255,255,255,0.07)" strokeWidth="6" />
      <circle cx="24" cy="24" r={r} fill="none"
        stroke="currentColor" strokeWidth="6"
        strokeDasharray={`${filled} ${circ - filled}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
        className="sp-donut-arc"
      />
      <text x="24" y="27" textAnchor="middle" fill="currentColor"
        fontSize="9.5" fontWeight="700" fontFamily='"Share Tech Mono", monospace'>
        {label}
      </text>
    </svg>
  );
};

/* ── Utility: animate a numeric value over time ── */
const animateValue = (from, to, setter, duration = 1500) => {
  const steps = 60;
  const stepTime = duration / steps;
  let count = 0;
  const id = setInterval(() => {
    count++;
    const eased = 1 - Math.pow(1 - count / steps, 3);
    setter(Math.round(from + (to - from) * eased));
    if (count >= steps) { setter(to); clearInterval(id); }
  }, stepTime);
  return id;
};

export const StatsPanel = () => {
  const {
    stats,
    challenge1Completed,
    challenge2Completed,
    challenge3Completed,
    challengeFinalCompleted,
    suspectUsersCount,
    escapeTimerStarted,
    escapeTimerRemainingMs,
    escapeTimerExpired,
    escapeTimerFlashTick,
    escapeTimerDurationMs,
  } = useStats();
  const { t } = useTranslation();
  const [countdownFlash, setCountdownFlash] = useState(false);
  const lastHandledFlashTickRef = useRef(escapeTimerFlashTick);
  const isCountdownCritical = escapeTimerRemainingMs <= 5 * 60 * 1000;

  useEffect(() => {
    if (!escapeTimerStarted || challengeFinalCompleted || !escapeTimerFlashTick) return;
    if (escapeTimerFlashTick <= lastHandledFlashTickRef.current) return;
    lastHandledFlashTickRef.current = escapeTimerFlashTick;
    setCountdownFlash(true);
    const timeoutId = setTimeout(() => setCountdownFlash(false), isCountdownCritical ? 1700 : 1300);
    return () => clearTimeout(timeoutId);
  }, [escapeTimerFlashTick, escapeTimerStarted, challengeFinalCompleted, isCountdownCritical]);

  const countdownText = (() => {
    const totalSeconds = Math.max(0, Math.ceil(escapeTimerRemainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  })();

  /* ── Animated display values ── */
  const [animBotPct,      setAnimBotPct]      = useState(() => challenge1Completed ? 0  : stats.botActivity.percentage);
  const [animBotDetected, setAnimBotDetected] = useState(() => challenge1Completed ? 0  : stats.botActivity.detected);
  const [animBotSuspect,  setAnimBotSuspect]  = useState(() => challenge1Completed ? 0  : suspectUsersCount);
  const [animAiPct,       setAnimAiPct]       = useState(() => challenge2Completed ? 4  : 34);
  const [animIntegrity,   setAnimIntegrity]   = useState(() => challenge3Completed ? 92 : 22);
  const [animMisuse,      setAnimMisuse]      = useState(() => challenge3Completed ? 0  : 3);
  const [animThreat,      setAnimThreat]      = useState(() =>
    challenge3Completed ? 0 : challenge2Completed ? 26 : challenge1Completed ? 52 : 78
  );

  /* ── Celebration flags ── */
  const [celebrating1, setCelebrating1] = useState(false);
  const [celebrating2, setCelebrating2] = useState(false);
  const [celebrating3, setCelebrating3] = useState(false);

  /* ── Track previous state to detect fresh completions ── */
  const prevC1 = useRef(challenge1Completed);
  const prevC2 = useRef(challenge2Completed);
  const prevC3 = useRef(challenge3Completed);

  /* ── Keep pre-completion values in sync with context ── */
  useEffect(() => {
    if (!challenge1Completed) {
      setAnimBotPct(stats.botActivity.percentage);
      setAnimBotDetected(stats.botActivity.detected);
    }
  }, [stats.botActivity.percentage, stats.botActivity.detected, challenge1Completed]);

  useEffect(() => {
    if (!challenge1Completed) setAnimBotSuspect(suspectUsersCount);
  }, [suspectUsersCount, challenge1Completed]);

  /* ── Trigger animations on new completion ── */
  useEffect(() => {
    if (!challenge1Completed || prevC1.current) return;
    prevC1.current = true;
    setCelebrating1(true);
    setTimeout(() => setCelebrating1(false), 2400);
    animateValue(stats.botActivity.percentage, 0, setAnimBotPct);
    animateValue(stats.botActivity.detected,   stats.botActivity.detected + suspectUsersCount, setAnimBotDetected);
    animateValue(suspectUsersCount,             0, setAnimBotSuspect);
    animateValue(78, 52, setAnimThreat);
  }, [challenge1Completed, stats.botActivity.detected, suspectUsersCount]);

  useEffect(() => {
    if (!challenge2Completed || prevC2.current) return;
    prevC2.current = true;
    setCelebrating2(true);
    setTimeout(() => setCelebrating2(false), 2400);
    animateValue(34, 4, setAnimAiPct);
    animateValue(challenge1Completed ? 52 : 78, 26, setAnimThreat);
  }, [challenge2Completed]);

  useEffect(() => {
    if (!challenge3Completed || prevC3.current) return;
    prevC3.current = true;
    setCelebrating3(true);
    setTimeout(() => setCelebrating3(false), 2400);
    animateValue(22, 92, setAnimIntegrity);
    animateValue(3,   0, setAnimMisuse);
    animateValue(challenge2Completed ? 26 : challenge1Completed ? 52 : 78, 0, setAnimThreat);
  }, [challenge3Completed]);

  /* ── Derived colour classes (actual colours defined in CSS) ── */
  const threatClass    = animThreat    >= 70 ? "sp-color--danger" : animThreat    >= 40 ? "sp-color--warn" : "sp-color--ok";
  const botClass       = animBotPct    >  0  ? "sp-color--danger" : "sp-color--ok";
  const aiClass        = animAiPct     > 10  ? "sp-color--offline" : "sp-color--ok";
  const integrityClass = animIntegrity < 50  ? "sp-color--warn"   : "sp-color--ok";


  // Calcular tiempo empleado si se ha completado el escape room
  let completionTimeText = null;
  if (challengeFinalCompleted && escapeTimerStarted) {
    const totalSeconds = Math.max(0, Math.floor((escapeTimerDurationMs - escapeTimerRemainingMs) / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    completionTimeText = t("statsPanel.completionTimeMsg", { minutes, seconds });
  }

  return (
    <div className="stats-panel">

      {(escapeTimerStarted && !challengeFinalCompleted) && (
        <div className="timer-container">
          <div className={`sp-countdown-hero ${isCountdownCritical ? "sp-countdown-hero--critical" : ""} ${countdownFlash ? "sp-countdown-hero--flash" : ""}`}>
            <span className="sp-countdown-hero-label">{t("shared.timeLeft")}</span>
            <span className="sp-countdown-hero-value">{countdownText}</span>
            {escapeTimerExpired && (
              <p className="sp-countdown-hero-hint">{t("statsPanel.timerExpiredContinue")}</p>
            )}
          </div>
        </div>
      )}

      {/* Mostrar timer congelado y mensaje de tiempo empleado al completar */}
      {(escapeTimerStarted && challengeFinalCompleted) && (
        <div className="timer-container">
          <div className="sp-countdown-hero sp-countdown-hero--completed">
            <span className="sp-countdown-hero-label">{t("shared.timeLeft")}</span>
            <span className="sp-countdown-hero-value">{countdownText}</span>
          </div>
          {completionTimeText && (
            <div className="sp-countdown-hero-hint sp-countdown-hero-hint--completed">
              {completionTimeText}
            </div>
          )}
        </div>
      )}

      {/* ── Header ── */}
      <div className="sp-header">
        <span className="sp-header-title">{t("statsPanel.title")}</span>
        <span className={`sp-sys-badge ${challenge3Completed ? "sp-sys-badge--ok" : "sp-sys-badge--alert"}`}>
          {challenge3Completed ? t("statsPanel.statusSecure") : t("statsPanel.statusAlert")}
        </span>
      </div>

      {/* ── Gauge de amenaza ── */}
      <div className="sp-threat">
        <div className="sp-gauge-wrap">
          <span className="sp-threat-name">{t("statsPanel.misinformationLevel")}</span>
          <HalfGauge value={animThreat} colorClass={threatClass} />
        </div>
      </div>

      {/* ══════════════════════════════════════
          MÓDULO 1 — Red de Bots
          ══════════════════════════════════════ */}
      <div className={`sp-module${challenge1Completed ? " sp-module--success" : ""}${celebrating1 ? " sp-module--celebrating" : ""}`}>
        <div className="sp-mod-head">
          <FaRobot className={`sp-mod-icon ${challenge1Completed ? "sp-mod-icon--success" : "sp-mod-icon--danger"}`} />
          <span className="sp-mod-title">{t("statsPanel.botModule.title")}</span>
          {challenge1Completed
            ? <span className="sp-badge sp-badge--ok">{t("statsPanel.statusSecure")}</span>
            : <span className="sp-badge sp-badge--danger">{t("statsPanel.statusAlert")}</span>
          }
        </div>

        <div className="sp-chart-row">
          <DonutChart pct={animBotPct} colorClass={botClass} label={`${animBotPct}%`} />
          <div className="sp-chart-metrics">
            <div className={`sp-metric-box ${challenge1Completed ? "sp-metric-box--ok" : "sp-metric-box--danger"}`}>
              <span className="sp-metric-val">{animBotDetected}</span>
              <span className="sp-metric-lbl">{t("statsPanel.botModule.detected")}</span>
            </div>
            <div className={`sp-metric-box ${challenge1Completed ? "sp-metric-box--ok" : "sp-metric-box--danger"}`}>
              <span className="sp-metric-val">{animBotSuspect}</span>
              <span className="sp-metric-lbl">{t("statsPanel.botModule.suspicious")}</span>
            </div>
          </div>
        </div>

        <p className="sp-mod-note">
          {challenge1Completed ? t("statsPanel.botModule.resolvedNote") : t("statsPanel.botModule.note")}
        </p>
      </div>

      {/* ══════════════════════════════════════
          MÓDULO 2 — Detector de IA
          ══════════════════════════════════════ */}
      <div className={`sp-module${challenge2Completed ? " sp-module--success" : ""}${celebrating2 ? " sp-module--celebrating" : ""}`}>
        <div className="sp-mod-head">
          <FaBrain className={`sp-mod-icon ${challenge2Completed ? "sp-mod-icon--success" : "sp-mod-icon--offline"}`} />
          <span className="sp-mod-title">{t("statsPanel.aiModule.title")}</span>
          {challenge2Completed
            ? <span className="sp-badge sp-badge--ok">{t("statsPanel.aiModule.statusOnline")}</span>
            : <span className="sp-badge sp-badge--offline">{t("statsPanel.aiModule.status")}</span>
          }
        </div>

        <div className="sp-chart-row">
          <div className="sp-donut-wrap">
            <DonutChart pct={animAiPct} colorClass={aiClass} label={challenge2Completed ? `${animAiPct}%` : "~34%"} />
            <span className="sp-donut-sub">{t("statsPanel.aiModule.aiContentRate")}</span>
          </div>
          <div className="sp-status-list">
            <div className="sp-status-row">
              <span className={`sp-dot ${challenge2Completed ? "sp-dot--on" : "sp-dot--off"}`} />
              <span className="sp-status-text">
                {challenge2Completed ? t("statsPanel.aiModule.detectorOnline") : t("statsPanel.aiModule.detector")}
              </span>
            </div>
            <div className="sp-status-row">
              <span className={`sp-dot ${challenge2Completed ? "sp-dot--off" : "sp-dot--on"}`} />
              <span className="sp-status-text">{t("statsPanel.aiModule.manualMode")}</span>
            </div>
          </div>
        </div>

        <p className={`sp-mod-note${challenge2Completed ? "" : " sp-mod-note--warn"}`}>
          {challenge2Completed ? t("statsPanel.aiModule.resolvedNote") : t("statsPanel.aiModule.reason")}
        </p>
      </div>

      {/* ══════════════════════════════════════
          MÓDULO 3 — Moderación de contenido
          ══════════════════════════════════════ */}
      <div className={`sp-module${challenge3Completed ? " sp-module--success" : ""}${celebrating3 ? " sp-module--celebrating" : ""}`}>
        <div className="sp-mod-head">
          <FaFlag className={`sp-mod-icon ${challenge3Completed ? "sp-mod-icon--success" : "sp-mod-icon--warn"}`} />
          <span className="sp-mod-title">{t("statsPanel.modModule.title")}</span>
          {challenge3Completed
            ? <span className="sp-badge sp-badge--ok">{t("statsPanel.doneModule.status")}</span>
            : <span className="sp-badge sp-badge--warn">{t("statsPanel.modModule.status")}</span>
          }
        </div>

        <div className="sp-chart-row">
          <div className="sp-donut-wrap">
            <DonutChart pct={animIntegrity} colorClass={integrityClass} label={`${animIntegrity}%`} />
            <span className="sp-donut-sub">{t("statsPanel.modModule.integrity")}</span>
          </div>
          <div className="sp-stacked">
            <div className="sp-status-list">
              <div className="sp-status-row">
                <span className={`sp-dot ${challenge3Completed ? "sp-dot--off" : "sp-dot--on"}`} />
                <span className="sp-status-text">{t("statsPanel.modModule.manual")}</span>
              </div>
              {challenge3Completed && (
                <div className="sp-status-row">
                  <span className="sp-dot sp-dot--on" />
                  <span className="sp-status-text">{t("statsPanel.modModule.automated")}</span>
                </div>
              )}
            </div>
            <div className={`sp-metric-box sp-metric-box--inline ${challenge3Completed ? "sp-metric-box--ok" : "sp-metric-box--warn"}`}>
              <span className="sp-metric-val">{animMisuse}</span>
              <span className="sp-metric-lbl">{t("statsPanel.modModule.misuse")}</span>
            </div>
          </div>
        </div>

        <p className={`sp-mod-note${challenge3Completed ? "" : " sp-mod-note--warn"}`}>
          {challenge3Completed ? t("statsPanel.doneModule.note") : t("statsPanel.modModule.note")}
        </p>
      </div>

    </div>
  );
};
