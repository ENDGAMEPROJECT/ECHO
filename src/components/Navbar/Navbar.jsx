import "./Navbar.css";
import React from "react";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { useStats } from "../../contexts/StatsProvider.jsx";
import { useTranslation } from 'react-i18next';
import { PopupNotification } from "../PopupNotification/PopupNotification";
import {
  RiHomeWifiLine,
  CgProfile,
} from "../../utils/icons.jsx";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiRobotLine, RiErrorWarningLine } from "react-icons/ri";
import { NewPostLauncher } from "../../pages/NewPost/NewPostLauncher.jsx";
import { useXAPI } from "../../contexts/XAPIProvider.jsx";

export const Navbar = ({ blocked = false }) => {
  const { t } = useTranslation();
  const {
    challenge1Completed, challenge2Completed, challenge3Completed,
    challenge2InstructionsRead, challenge3InstructionsRead,
    suspectUsersCount, challenge1Progress,
    challenge2Total, challenge2Progress,
    challenge3Total, challenge3Progress
  } = useStats();
  const { trackChallengeStarted } = useXAPI();

  const startIfNotStarted = (id, name, completed = false) => {
    if (completed) return;
    if (!sessionStorage.getItem(`echo:challengeStart:${id}`)) {
      trackChallengeStarted(id, name);
    }
  };
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    position: { top: 0, left: 0 },
  });


  const getActiveStyle = ({ isActive }) => ({
    color: blocked ? "rgba(255,255,255,0.3)" : isActive ? "rgb(29, 155, 240)" : "white",
    pointerEvents: blocked ? "none" : undefined,
    cursor: blocked ? "not-allowed" : undefined,
  });

  const getDisabledStyle = () => ({
    color: "rgba(255, 255, 255, 0.3)",
    cursor: "not-allowed",
    pointerEvents: "none",
  });

  const handleShowBlockedPopup = (e, messageKey = "desktop.popup.playChallenge") => {
    // Asegurarse de obtener el elemento li o div correcto
    let target = e.currentTarget;
    
    // Si el click fue en un elemento hijo, ir al parent
    if (!target.classList?.contains("disabled")) {
      target = target.closest(".disabled") || target.closest("li");
    }

    const rect = target?.getBoundingClientRect();
    if (!rect) return;

    const popupWidth = 280;
    setPopup({
      visible: true,
      message: t(messageKey),
      position: {
        top: Math.max(50, rect.top - 60),
        left: Math.max(10, rect.left + rect.width / 2 - popupWidth / 2),
      },
    });
  };

  const handleClosePopup = () => {
    setPopup({ ...popup, visible: false });
  };

  const pendingChallenge1 = challenge1Completed ? 0 : Math.max(0, suspectUsersCount - challenge1Progress);
  const pendingChallenge2 = challenge2Completed ? 0 : Math.max(0, challenge2Total - challenge2Progress);
  const pendingChallenge3 = challenge3Completed ? 0 : Math.max(0, challenge3Total - challenge3Progress);

  return (
    <nav className={blocked ? "navbar navbar--blocked" : "navbar"} style={blocked ? { cursor: "not-allowed" } : {}}>
      <ul>
        <li>
          <NavLink className="navlink" style={getActiveStyle} to="/">
            {<RiHomeWifiLine className="navlink-icon" />}
            <p>{t('nav.home')}</p>
          </NavLink>
        </li>
        <li>
          <NavLink
            className="navlink"
            style={getActiveStyle}
            to="/profile/ECHO"
          >
            <CgProfile className="navlink-icon" />
            <p>{t('nav.profile')}</p>
          </NavLink>
        </li>
        <li>
          <NavLink className="navlink" style={getActiveStyle} to="/admin" onClick={() => startIfNotStarted('1', 'Puzzle 1 - Bot Detection', challenge1Completed)}>
            <MdAdminPanelSettings className="navlink-icon" />
            <p className="navlink-label">
              <span className="navlink-label-text">{t('nav.admin')}</span>
              {pendingChallenge1 > 0 && <span className="nav-badge">{pendingChallenge1}</span>}
            </p>
          </NavLink>
        </li>
        <li>
          {challenge2InstructionsRead ? (
            <NavLink 
              className="navlink"
              style={getActiveStyle} 
              to="/ai-content"
              onClick={() => startIfNotStarted('2', 'Puzzle 2 - AI Content Generated', challenge2Completed)}
            >
              <RiRobotLine className="navlink-icon" />
              <p className="navlink-label">
                <span className="navlink-label-text">{t('nav.aiContent')}</span>
                {pendingChallenge2 > 0 && <span className="nav-badge">{pendingChallenge2}</span>}
              </p>
            </NavLink>
          ) : (
            <div
              className="navlink disabled"
              style={getDisabledStyle()}
              onClick={(e) => handleShowBlockedPopup(e, challenge1Completed ? "desktop.popup.readMessageChallenge2" : "desktop.popup.completeChallenge1")}
              role="button"
            >
              <RiRobotLine className="navlink-icon" />
              <p className="navlink-label">
                <span className="navlink-label-text">{t('nav.aiContent')}</span>
                {pendingChallenge2 > 0 && <span className="nav-badge">{pendingChallenge2}</span>}
              </p>
            </div>
          )}
        </li>
        <li>
          {challenge3InstructionsRead ? (
            <NavLink 
              className="navlink"
              style={getActiveStyle} 
              to="/ai-incorrect-uses"
              onClick={() => startIfNotStarted('3', 'Puzzle 3 - AI Incorrect Uses', challenge3Completed)}
            >
              <RiErrorWarningLine className="navlink-icon" />
              <p className="navlink-label">
                <span className="navlink-label-text">{t('nav.aiIncorrectUses')}</span>
                {pendingChallenge3 > 0 && <span className="nav-badge">{pendingChallenge3}</span>}
              </p>
            </NavLink>
          ) : (
            <div
              className="navlink disabled"
              style={getDisabledStyle()}
              onClick={(e) => handleShowBlockedPopup(e, challenge2Completed ? "desktop.popup.readMessageChallenge3" : "desktop.popup.completeChallenge2")}
              role="button"
            >
              <RiErrorWarningLine className="navlink-icon" />
              <p className="navlink-label">
                <span className="navlink-label-text">{t('nav.aiIncorrectUses')}</span>
                {pendingChallenge3 > 0 && <span className="nav-badge">{pendingChallenge3}</span>}
              </p>
            </div>
          )}
        </li>
            <NewPostLauncher />
      </ul>
  

      {popup.visible && (
        <PopupNotification
          message={popup.message}
          position={popup.position}
          onClose={handleClosePopup}
          duration={800}
        />
      )}
    </nav>
  );
};
