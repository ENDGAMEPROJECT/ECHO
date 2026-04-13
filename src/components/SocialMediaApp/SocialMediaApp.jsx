import React, { useMemo, useState, useEffect, useRef } from "react";
import "./SocialMediaApp.css";
import { useOS } from "../../contexts/OSProvider";
import { NavRoutes } from "../../Routes/NavRoutes";
import { FaTimes, FaMinus, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useStats } from "../../contexts/StatsProvider";
import { useUser } from "../../contexts/UserProvider";
import { useMessages } from "../../contexts/MessagesProvider";
import { useNavigate } from "react-router-dom";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "../../contexts/XAPIProvider";
import { assetPath } from "../../utils/assetPath";

/**
 * Componente SocialMediaApp - Envuelve la aplicación de red social en una ventana
 */
export const SocialMediaApp = ({ mode = "window" }) => {
  const { closeApp, minimizeApp } = useOS();
  const { t } = useTranslation();
  const { challenge1Completed, setSuspectUsersCount } = useStats();
  const { userState } = useUser();
  const { sendStatement } = useXAPI();
  const { addMessage } = useMessages();
  const navigate = useNavigate();

  // Calcular el número de cuentas sospechosas en cuanto los usuarios carguen
  useEffect(() => {
    if (challenge1Completed || !userState?.allUsers?.length) return;
    const bots = userState.allUsers.filter(u => u.puzzle?.isBot === true);
    const humans = userState.allUsers.filter(u => u.puzzle?.isBot === false);
    const count = Math.min(bots.length, 3) + Math.min(humans.length, 2);
    setSuspectUsersCount(count);
  }, [userState?.allUsers, challenge1Completed]);
  const isEmbedded = mode === "embedded";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loginErrorKey, setLoginErrorKey] = useState("");
  const [loginDone, setLoginDone] = useState(
    () => sessionStorage.getItem("socialLoginDone") === "true"
  );
  const prevLoginDoneRef = useRef(loginDone);

  const shouldRequireLogin = useMemo(() => {
    const missionBriefRead = sessionStorage.getItem("missionBriefRead") === "true";
    return missionBriefRead && !challenge1Completed;
  }, [challenge1Completed]);

  // Solo navegar a home cuando loginDone acaba de cambiar de false a true (login real)
  useEffect(() => {
    const prev = prevLoginDoneRef.current;
    prevLoginDoneRef.current = loginDone;
    if (loginDone && !prev && !sessionStorage.getItem("fromAdmin")) {
      navigate("/", { replace: true });
    }
    // Run only when login state changes; route changes should not trigger redirects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginDone]);

  // Enviar el mensaje challenge1 después de que el usuario inicie sesión
  useEffect(() => {
    if (!loginDone) return;
    const challenge1InstructionsSent = sessionStorage.getItem("challenge1InstructionsSent");
    if (!challenge1InstructionsSent) {
      sessionStorage.setItem("challenge1InstructionsSent", "true");
      addMessage({
        fromKey: "messagesApp.author.name",
        subjectKey: "messagesApp.messages.challenge1.subject",
        contentKey: "messagesApp.messages.challenge1.content",
      });
      window.dispatchEvent(new Event("openDrawer"));
      window.dispatchEvent(new Event("bossMessage"));
    }
  }, [loginDone, addMessage]);

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    const isValid = username === "echo" && password === "MintAI_mod";
    if (isValid) {
      sessionStorage.setItem("socialLoginDone", "true");
      setLoginDone(true);
      setLoginErrorKey("");
      sendStatement(
        XAPI_VERBS.ACCESSED,
        ECHO_ACTIVITIES.SOCIAL_APP,
        null,
        {
          contextActivities: {
            grouping: [ECHO_ACTIVITIES.GAME],
          },
        }
      );
      navigate("/", { replace: true });
      return;
    }
    setLoginErrorKey("socialLogin.errorInvalid");
  };

  return (
    <div className={isEmbedded ? "social-app-embedded" : "social-app-window"}>
      {!isEmbedded && (
        <div className="window-titlebar">
          <div className="window-title">
               <img
          src={assetPath("/assets/echo-logo.png")}
          alt="ECHO logo"

          onClick={() => navigate("/")}
          className="window-title-logo"
        />

          </div>
          <div className="window-controls">
            <button
              className="window-button minimize"
              onClick={minimizeApp}
              title={t("desktop.window.minimize")}
            >
              <FaMinus />
            </button>
            <button
              className="window-button close"
              onClick={() => closeApp("social")}
              title={t("desktop.window.close")}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Contenido de la aplicación */}
      <div className="social-app-content">
        {shouldRequireLogin && !loginDone ? (
          <div className="social-login">
            <form className="social-login-card" onSubmit={handleLoginSubmit}>
              <div className="social-login-header">
                <div className="social-login-brand">
                  <img
                    src={assetPath("/assets/echo-logo-bg.png")}
                    alt="ECHO"
                    className="social-login-logo"
                  />
                  <span className="social-login-brand-name">ECHO</span>
                </div>
                <span className="social-login-title">{t("socialLogin.title")}</span>
                <span className="social-login-subtitle">
                  {t("socialLogin.subtitle")}
                </span>
              </div>
              <div className="social-login-fields">
                <label className="social-login-label" htmlFor="login-username">
                  {t("socialLogin.usernameLabel")}
                </label>
                <input
                  id="login-username"
                  className="social-login-input"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="echo"
                  autoComplete="username"
                />
                <label className="social-login-label" htmlFor="login-password">
                  {t("socialLogin.passwordLabel")}
                </label>
                <div className="social-login-password-field">
                  <input
                    id="login-password"
                    className="social-login-input social-login-password-input"
                    type={isPasswordVisible ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="MintAI_mod"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="social-login-password-toggle"
                    onClick={() => setIsPasswordVisible((prev) => !prev)}
                    aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                  >
                    {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {loginErrorKey && (
                  <span className="social-login-error">{t(loginErrorKey)}</span>
                )}
              </div>
              <button className="social-login-button" type="submit">
                {t("socialLogin.submit")}
              </button>
            </form>
          </div>
        ) : (
          <NavRoutes />
        )}
      </div>
    </div>
  );
};
