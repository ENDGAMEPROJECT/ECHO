import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useStats } from "./StatsProvider.jsx";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "./XAPIProvider.jsx";

/**
 * Contexto para gestionar los mensajes del jefe
 * Proporciona las pistas del juego al jugador
 */
const MessagesContext = createContext();

export const useMessages = () => {
  const context = useContext(MessagesContext);
  if (!context) {
    throw new Error("useMessages debe usarse dentro de MessagesProvider");
  }
  return context;
};

/**
 * Build initial messages array from sessionStorage state
 */
const buildInitialMessages = () => {
  const messages = [];
  let id = 1;

  // Mission brief is always present
  const missionBriefRead = sessionStorage.getItem("missionBriefRead") === "true";
  messages.push({
    id: id++,
    fromKey: "messagesApp.author.name",
    subjectKey: "messagesApp.messages.missionBrief.subject",
    contentKey: "messagesApp.messages.missionBrief.content",
    timestamp: new Date(),
    read: missionBriefRead,
  });

  // Challenge 1 instructions (sent after user logs in to the social network)
  const challenge1InstructionsSent = sessionStorage.getItem("challenge1InstructionsSent");
  const challenge1InstructionsRead = sessionStorage.getItem("challenge1InstructionsRead");
  if (challenge1InstructionsSent) {
    messages.push({
      id: id++,
      fromKey: "messagesApp.author.name",
      subjectKey: "messagesApp.messages.challenge1.subject",
      contentKey: "messagesApp.messages.challenge1.content",
      timestamp: new Date(),
      read: challenge1InstructionsRead === "true",
    });
  }

  // Challenge 2 instructions (sent after completing challenge 1)
  const challenge2InstructionsSent = sessionStorage.getItem("challenge2InstructionsSent");
  const challenge2InstructionsRead = sessionStorage.getItem("challenge2InstructionsRead");
  if (challenge2InstructionsSent) {
    messages.unshift({
      id: id++,
      fromKey: "messagesApp.author.name",
      subjectKey: "messagesApp.messages.challenge2.subject",
      contentKey: "messagesApp.messages.challenge2.content",
      timestamp: new Date(),
      read: challenge2InstructionsRead === "true",
    });
  }

  // Challenge 3 instructions (sent after completing challenge 2)
  const challenge3InstructionsSent = sessionStorage.getItem("challenge3InstructionsSent");
  const challenge3InstructionsRead = sessionStorage.getItem("challenge3InstructionsRead");
  if (challenge3InstructionsSent) {
    messages.unshift({
      id: id++,
      fromKey: "messagesApp.author.name",
      subjectKey: "messagesApp.messages.challenge3.subject",
      contentKey: "messagesApp.messages.challenge3.content",
      timestamp: new Date(),
      read: challenge3InstructionsRead === "true",
    });
  }

  // Final challenge instructions (sent after completing challenge 3)
  const challengeFinalInstructionsSent = sessionStorage.getItem("challengeFinalInstructionsSent");
  const challengeFinalInstructionsRead = sessionStorage.getItem("challengeFinalInstructionsRead");
  if (challengeFinalInstructionsSent) {
    messages.unshift({
      id: id++,
      fromKey: "messagesApp.author.name",
      subjectKey: "messagesApp.messages.challengeFinal.subject",
      contentKey: "messagesApp.messages.challengeFinal.content",
      timestamp: new Date(),
      read: challengeFinalInstructionsRead === "true",
    });
  }

  return messages;
};

export const MessagesProvider = ({ children }) => {
  const { t } = useTranslation();
  const {
    markChallenge1InstructionsRead,
    markChallenge2InstructionsRead,
    markChallenge3InstructionsRead,
    markChallengeFinalInstructionsRead,
  } = useStats();
  const { sendStatement } = useXAPI();

  const [messages, setMessages] = useState(() => buildInitialMessages());
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationShownRef = useRef(false);
  const xapiSentRef = useRef(new Set());

  const showMissionToast = () => {
    if (notificationShownRef.current) {
      return;
    }
    window.dispatchEvent(new Event("openDrawer"));
    window.dispatchEvent(new Event("bossMessage"));
    notificationShownRef.current = true;
  };

  // Mostrar notificación cuando el onboarding se completa o hay mensajes no leídos
  useEffect(() => {
    const handleOnboardingComplete = () => {
      showMissionToast();
    };

    const playerData = sessionStorage.getItem("playerData");
    if (playerData) {
      const data = JSON.parse(playerData);
      if (data.onboardingCompleted) {
        // Check if there are unread messages
        const hasUnread = messages.some((msg) => !msg.read);
        if (hasUnread) {
          showMissionToast();
        }
      }
    }

    window.addEventListener("onboardingComplete", handleOnboardingComplete);
    return () => {
      window.removeEventListener("onboardingComplete", handleOnboardingComplete);
    };
  }, []);

  // Actualizar contador de mensajes no leídos
  useEffect(() => {
    const count = messages.filter((msg) => !msg.read).length;
    setUnreadCount(count);
  }, [messages]);

  /**
   * Marca un mensaje como leído
   * @param {number} messageId - ID del mensaje
   */
  const markAsRead = (messageId) => {
    const target = messages.find((msg) => msg.id === messageId);
    if (!target || target.read) return;

    // Guard síncrono: evita duplicados si markAsRead se llama dos veces
    // antes de que React procese el setMessages (p.ej. Strict Mode)
    if (!xapiSentRef.current.has(messageId)) {
      xapiSentRef.current.add(messageId);

      if (target.contentKey === "messagesApp.messages.missionBrief.content") {
        sessionStorage.setItem("missionBriefRead", "true");
        sendStatement(
          XAPI_VERBS.LOOKED_AT,
          {
            id: `${ECHO_ACTIVITIES.PUZZLE_1.id}/instructions`,
            definition: {
              name: { en: "Puzzle 1 Instructions" },
              type: "http://adlnet.gov/expapi/activities/lesson",
            },
          },
          null,
          {
            contextActivities: {
              parent: [ECHO_ACTIVITIES.PUZZLE_1],
              grouping: [ECHO_ACTIVITIES.GAME],
            },
          }
        );
      }
      if (target.contentKey === "messagesApp.messages.challenge1.content") {
        markChallenge1InstructionsRead();
        sendStatement(
          XAPI_VERBS.LOOKED_AT,
          {
            id: `${ECHO_ACTIVITIES.PUZZLE_1.id}/challenge1`,
            definition: {
              name: { en: "Challenge 1 Instructions" },
              type: "http://adlnet.gov/expapi/activities/lesson",
            },
          },
          null,
          {
            contextActivities: {
              parent: [ECHO_ACTIVITIES.PUZZLE_1],
              grouping: [ECHO_ACTIVITIES.GAME],
            },
          }
        );
      }
      if (target.contentKey === "messagesApp.messages.challenge2.content") {
        markChallenge2InstructionsRead();
        sendStatement(
          XAPI_VERBS.LOOKED_AT,
          {
            id: `${ECHO_ACTIVITIES.PUZZLE_2.id}/instructions`,
            definition: {
              name: { en: "Puzzle 2 Instructions" },
              type: "http://adlnet.gov/expapi/activities/media",
            },
          },
          null,
          {
            contextActivities: {
              parent: [ECHO_ACTIVITIES.PUZZLE_2],
              grouping: [ECHO_ACTIVITIES.GAME],
            },
          }
        );
      }
      if (target.contentKey === "messagesApp.messages.challenge3.content") {
        markChallenge3InstructionsRead();
        sendStatement(
          XAPI_VERBS.LOOKED_AT,
          {
            id: `${ECHO_ACTIVITIES.PUZZLE_3.id}/instructions`,
            definition: {
              name: { en: "Puzzle 3 Instructions" },
              type: "http://adlnet.gov/expapi/activities/media",
            },
          },
          null,
          {
            contextActivities: {
              parent: [ECHO_ACTIVITIES.PUZZLE_3],
              grouping: [ECHO_ACTIVITIES.GAME],
            },
          }
        );
      }
      if (target.contentKey === "messagesApp.messages.challengeFinal.content") {
        markChallengeFinalInstructionsRead();
        sendStatement(
          XAPI_VERBS.LOOKED_AT,
          {
            id: `${ECHO_ACTIVITIES.FINAL.id}/instructions`,
            definition: {
              name: { en: "Final Puzzle Instructions" },
              type: "http://adlnet.gov/expapi/activities/media",
            },
          },
          null,
          {
            contextActivities: {
              parent: [ECHO_ACTIVITIES.FINAL],
              grouping: [ECHO_ACTIVITIES.GAME],
            },
          }
        );
      }
    }

    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
  };

  /**
   * Agrega un nuevo mensaje
   * @param {Object} message - Nuevo mensaje
   */
  const addMessage = (message) => {
    setMessages((prev) => {
      // Check if message with same contentKey already exists
      const exists = prev.some((msg) => msg.contentKey === message.contentKey);
      if (exists) return prev;

      const newMessage = {
        ...message,
        id: Math.max(...prev.map((m) => m.id), 0) + 1,
        timestamp: new Date(),
        read: false,
      };
      return [newMessage, ...prev];
    });
  };

  const value = {
    messages,
    unreadCount,
    markAsRead,
    addMessage,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
};
