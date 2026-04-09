import React from "react";
import "./Taskbar.css";
import { useOS } from "../../contexts/OSProvider";
import { useMessages } from "../../contexts/MessagesProvider";
import { FaComments, FaUsers, FaLightbulb, FaFolder } from "react-icons/fa";
import { useTranslation } from "react-i18next";


export const Taskbar = () => {
  const { openApps, activeApp, focusApp } = useOS();
  const { unreadCount } = useMessages();
  const { t } = useTranslation();

  const apps = [
    {
      id: "messages",
      name: t("desktop.apps.messages"),
      icon: <FaComments />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: "social",
      name: t("desktop.apps.social"),
      icon: <FaUsers />,
    },
    {
      id: "files",
      name: t("desktop.apps.files"),
      icon: <FaFolder />,
    },
    {
      id: "hints",
      name: t("hintsApp.title"),
      icon: <FaLightbulb />,
    },
  ];

  return (
    <div className="taskbar">
      <div className="taskbar-start">
        {/* Botón de inicio (opcional) */}
        <button className="start-button" title={t("desktop.taskbar.start")}>
          <span className="windows-logo">⊞</span>
        </button>
      </div>

      <div className="taskbar-apps-container">
        <div className="taskbar-apps">
          {apps.map((app) => (
            <button
              key={app.id}
              className={`taskbar-app-button ${
                openApps.includes(app.id) ? "open" : ""
              } ${activeApp === app.id ? "active" : ""}`}
              onClick={() => focusApp(app.id)}
              title={app.name}
            >
              <span className="app-icon">{app.icon}</span>
              <span className="app-name">{app.name}</span>
              {app.badge && <span className="app-badge">{app.badge}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="taskbar-tray">
        <div className="taskbar-clock">
          {new Date().toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};
