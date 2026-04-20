import "./AIIncorrectUses.css";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Header } from "../../components/Header/Header";
import { Navbar } from "../../components/Navbar/Navbar";
import { StatsPanel } from "../../components/StatsPanel/StatsPanel";
import { useUser } from "../../contexts/UserProvider.jsx";
import { useStats } from "../../contexts/StatsProvider.jsx";
import { useMessages } from "../../contexts/MessagesProvider.jsx";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "../../contexts/XAPIProvider.jsx";
import challengeData from "./AIIncorrectUses.json";
import { assetPath } from "../../utils/assetPath";

// Fisher-Yates shuffle algorithm
const shuffleArray = (items) => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

// Format ISO date to (e.g., "Jan 15, 2026")
const formatDate = (iso) => {
  if (!iso) return iso;
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
};

// Normalize and parse AI correctness: 'yes'/'true'/'ok'/'1'/'sí'→true, 'no'/'false'/'0'→false, else null
const parseAiOk = (value) => {
    if (typeof value === "boolean") return value;
    if (value === null || value === undefined) return null;
    const normalized = String(value).trim().toLowerCase();
    if (["si", "sí", "yes", "true", "ok", "1"].includes(normalized)) return true;
    if (["no", "false", "0"].includes(normalized)) return false;
    return null;
};

// Pick 3 cases: guarantee at least 1 with aiOk=true and 1 with aiOk=false, plus 1 random. Fallback to random 3
const pickThreeCasesWithAiConstraint = (allCases) => {
    if (allCases.length <= 3) return allCases;

    const yesCases = allCases.filter((item) => parseAiOk(item.aiOk) === true);
    const noCases = allCases.filter((item) => parseAiOk(item.aiOk) === false);

    // Cannot meet constraint → pick 3 random cases
    if (yesCases.length === 0 || noCases.length === 0) {
        return shuffleArray(allCases).slice(0, 3);
    }

    const firstYes = shuffleArray(yesCases)[0];
    const firstNo = shuffleArray(noCases)[0];
    const baseSelection = [firstYes, firstNo];

    const remainingPool = allCases.filter(
        (item) => !baseSelection.some((selected) => selected.id === item.id)
    );
    const third = shuffleArray(remainingPool)[0];

    if (!third) return shuffleArray(baseSelection);
    return shuffleArray([...baseSelection, third]);
};

// Safe JSON.parse for sessionStorage array data, returns [] on parse error
const parseStoredArray = (value) => {
    try {
        const parsed = JSON.parse(value || "[]");
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

// Filter object to keep only entries matching selectedIds (remove stale case data)
const keepOnlySelectedCaseKeys = (record, selectedIds) => {
    if (!record || typeof record !== "object") return {};
    return Object.fromEntries(
        Object.entries(record).filter(([caseId]) => selectedIds.includes(caseId))
    );
};

/**
 * Challenge 3 (AI Incorrect Uses) game page.
 * Players review case studies of AI misuse and formulate correct community responses.
 * Tracks correct answers, wrong attempts, and submitted replies per case.
 */
export const AIIncorrectUses = () => {
    const { t } = useTranslation();
    const currentLang = t("langKey");
    const { userState } = useUser();
    const { challenge3Completed, completeChallenge3, setChallenge3Total, setChallenge3Progress } = useStats();
    const { addMessage } = useMessages();
    const { sendStatement, trackChallengeStarted } = useXAPI();
    const completionSentRef = useRef(false);
    // Currently open case in modal
    const [activeCaseId, setActiveCaseId] = useState(null);
    // Wrong option selected by case: { caseId: optionId } during current attempt
    const [selectedWrongOption, setSelectedWrongOption] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("ai-incorrect:selectedWrongOption") || "null") || {}; } catch { return {}; }
    });
    // All wrong attempts by case: { caseId: { optionId: true, ... } }
    const [wrongSelections, setWrongSelections] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("ai-incorrect:wrongSelections") || "null") || {}; } catch { return {}; }
    });
    // Cases with correct answer selected: { caseId: true }
    const [correctSelected, setCorrectSelected] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("ai-incorrect:correctSelected") || "null") || {}; } catch { return {}; }
    });
    // Submitted replies by case: { caseId: true }
    const [sentReplies, setSentReplies] = useState(() => {
        try { return JSON.parse(sessionStorage.getItem("ai-incorrect:sentReplies") || "null") || {}; } catch { return {}; }
    });
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    // Dedup flag: prevents xAPI statements from firing multiple times
    // 3 random cases (selected once per language, persisted by ID)
    const challengeCases = useMemo(() => {
        const allCases = challengeData[currentLang] || challengeData.en || [];
        if (allCases.length <= 3) return allCases;

        const selectionKey = `ai-incorrect:caseSelection:${currentLang}`;
        const casesById = new Map(allCases.map((item) => [item.id, item]));
        const storedSelection = parseStoredArray(sessionStorage.getItem(selectionKey));
        const restoredCases = storedSelection
            .map((id) => casesById.get(id))
            .filter(Boolean);

        // Restore previously selected cases
        if (restoredCases.length === 3) {
            return restoredCases;
        }

        // First visit: pick 3 new cases
        const picked = pickThreeCasesWithAiConstraint(allCases);
        sessionStorage.setItem(selectionKey, JSON.stringify(picked.map((c) => c.id)));
        return picked;
    }, [currentLang]);
    // Shuffled answer options per case: preserves uniqueness via optionId
    const shuffledOptionsByCase = useMemo(() => {
        return challengeCases.reduce((acc, item) => {
            const optionsWithId = (item.options || []).map((option, index) => ({
                ...option,
                optionId: `${item.id}-${index}`,
            }));
            acc[item.id] = shuffleArray(optionsWithId);
            return acc;
        }, {});
    }, [challengeCases]);

    // Clean stale state for cases no longer in the game (after case re-selection)
    useEffect(() => {
        const selectedIds = challengeCases.map((item) => item.id);

        const normalizedWrongSelections = keepOnlySelectedCaseKeys(wrongSelections, selectedIds);
        if (Object.keys(normalizedWrongSelections).length !== Object.keys(wrongSelections).length) {
            setWrongSelections(normalizedWrongSelections);
            sessionStorage.setItem("ai-incorrect:wrongSelections", JSON.stringify(normalizedWrongSelections));
        }

        const normalizedCorrectSelected = keepOnlySelectedCaseKeys(correctSelected, selectedIds);
        if (Object.keys(normalizedCorrectSelected).length !== Object.keys(correctSelected).length) {
            setCorrectSelected(normalizedCorrectSelected);
            sessionStorage.setItem("ai-incorrect:correctSelected", JSON.stringify(normalizedCorrectSelected));
        }

        const normalizedSelectedWrongOption = keepOnlySelectedCaseKeys(selectedWrongOption, selectedIds);
        if (Object.keys(normalizedSelectedWrongOption).length !== Object.keys(selectedWrongOption).length) {
            setSelectedWrongOption(normalizedSelectedWrongOption);
            sessionStorage.setItem("ai-incorrect:selectedWrongOption", JSON.stringify(normalizedSelectedWrongOption));
        }

        const normalizedSentReplies = keepOnlySelectedCaseKeys(sentReplies, selectedIds);
        if (Object.keys(normalizedSentReplies).length !== Object.keys(sentReplies).length) {
            setSentReplies(normalizedSentReplies);
            sessionStorage.setItem("ai-incorrect:sentReplies", JSON.stringify(normalizedSentReplies));
        }
    }, [challengeCases]);
    
    // Initialize challenge timer (fallback for direct URL access)
    useEffect(() => {
        if (challenge3Completed) return;
        if (!sessionStorage.getItem('echo:challengeStart:3')) {
            trackChallengeStarted('3', 'Puzzle 3 - AI Incorrect Uses');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        document.body.classList.add("ai-incorrect-no-scroll");
        document.documentElement.classList.add("ai-incorrect-no-scroll");

        return () => {
            document.body.classList.remove("ai-incorrect-no-scroll");
            document.documentElement.classList.remove("ai-incorrect-no-scroll");
        };
    }, []);

    // Update navbar badge: progress = count of submitted replies
    useEffect(() => {
        setChallenge3Total(challengeCases.length);
        setChallenge3Progress(Object.keys(sentReplies).length);
    }, [challengeCases.length, sentReplies, setChallenge3Total, setChallenge3Progress]);

    // Complete challenge, send final message to player
    const handleCompletionClose = () => {
        setShowCompletionModal(false);
        completeChallenge3();
        sessionStorage.setItem("challengeFinalInstructionsSent", JSON.stringify(true));
        addMessage({
            fromKey: "messagesApp.author.name",
            subjectKey: "messagesApp.messages.challengeFinal.subject",
            contentKey: "messagesApp.messages.challengeFinal.content",
        });
        window.dispatchEvent(new Event("openDrawer"));
        window.dispatchEvent(new Event("bossMessage"));
    };

    // Detect completion: all cases replied, send xAPI, show modal
    useEffect(() => {
        const totalCases = challengeCases.length;
        const completedCases = Object.keys(sentReplies).length;

        if (completedCases === totalCases && !challenge3Completed) {
            const instructionsSent = sessionStorage.getItem("challengeFinalInstructionsSent");
            if (instructionsSent) return;

            // Fire-once guard on first completion detection
            if (!completionSentRef.current) {
                completionSentRef.current = true;
            } else {
                return;
            }

            // Dedup: prevent double xAPI send
            const completedKey = 'echo:challengeCompleted:3';
            if (!sessionStorage.getItem(completedKey)) {
                sessionStorage.setItem(completedKey, '1');

                const context = {
                    contextActivities: {
                        parent: [ECHO_ACTIVITIES.GAME],
                        grouping: [ECHO_ACTIVITIES.GAME],
                    },
                };

                // Send "succeeded" with perfect score (all cases answered)
                sendStatement(
                    XAPI_VERBS.SUCCEEDED,
                    ECHO_ACTIVITIES.PUZZLE_3,
                    {
                        success: true,
                        completion: true,
                        score: { scaled: 1, raw: totalCases, min: 0, max: totalCases },
                    },
                    context
                );

                // Send "completed" with duration from challenge start
                const startRaw = sessionStorage.getItem('echo:challengeStart:3');
                const completedResult = { completion: true };
                if (startRaw && Number.isFinite(Number(startRaw))) {
                    const durationMs = Date.now() - Number(startRaw);
                    completedResult.duration = `PT${Math.max(0, Math.round(durationMs / 1000))}S`;
                    completedResult.extensions = { "https://endgameproject.github.io/xapi/ext/durationMs": durationMs };
                }
                sessionStorage.removeItem('echo:challengeStart:3');
                sendStatement(XAPI_VERBS.COMPLETED, ECHO_ACTIVITIES.PUZZLE_3, completedResult, context);
            }

            setShowCompletionModal(true);
        }
    }, [sentReplies, challengeCases.length, challenge3Completed, sendStatement]);

    // Modal context: active case and its display state
    const activeCase = challengeCases.find((item) => item.id === activeCaseId) || null;
    const activeCaseOptions = activeCase ? (shuffledOptionsByCase[activeCase.id] || []) : [];
    const activeWrongSelections = activeCaseId ? (wrongSelections[activeCaseId] || {}) : {};
    const isResolved = activeCaseId ? Boolean(correctSelected[activeCaseId]) : false; // Case solved with correct answer
    const canSendReply = activeCaseId ? Boolean(correctSelected[activeCaseId]) : false; // Enable send button only if correct

    // ECHO official account (fallback: try to find ECHO user, then default avatar)
    const echoOfficialUser = {
        _id: "echo-official",
        firstName: t("officialAccount.name") || "ECHO Official Account",
        lastName: "",
        username: "ECHO",
        avatarURL: "/assets/echo-logo-bg.png"
    }
        userState?.allUsers?.find((user) => user.username === "ECHO") || userState?.allUsers?.[0];

    // Select answer option: send xAPI, track if correct or wrong
    const handleOptionClick = (selectedOptionId) => {
        if (!activeCase || isResolved) return; // Already resolved OK

        const option = activeCaseOptions.find((opt) => opt.optionId === selectedOptionId) || null;
        if (!option) return;

        const isCorrect = option.isCorrect === true;
        // Send xAPI answer statement
        sendStatement(
            XAPI_VERBS.ANSWERED,
            {
                id: `${ECHO_ACTIVITIES.PUZZLE_3.id}/case/${activeCase.id}/option`,
                definition: {
                    name: { en: `Select Response for Case ${activeCase.id}` },
                    description: { en: activeCase.post.text },
                    type: "http://adlnet.gov/expapi/activities/cmi.interaction",
                    interactionType: "choice",
                    choices: activeCaseOptions.map((opt) => ({
                        id: opt.optionId,
                        description: { en: opt.text },
                    })),
                    correctResponsesPattern: [
                        activeCaseOptions.find((opt) => opt.isCorrect)?.optionId || "",
                    ],
                },
            },
            {
                success: isCorrect,
                score: { scaled: isCorrect ? 1 : 0, raw: isCorrect ? 1 : 0, min: 0, max: 1 },
                response: option.text,
            },
            {
                contextActivities: {
                    parent: [ECHO_ACTIVITIES.PUZZLE_3],
                    grouping: [ECHO_ACTIVITIES.GAME],
                },
            }
        );

        if (isCorrect) {
            // Correct answer selected: mark case as answered correctly
            const next = { ...correctSelected, [activeCase.id]: true };
            setCorrectSelected(next);
            sessionStorage.setItem("ai-incorrect:correctSelected", JSON.stringify(next));
            // Clear any wrong selection highlight for this case
            const next2 = { ...selectedWrongOption, [activeCase.id]: null };
            setSelectedWrongOption(next2);
            sessionStorage.setItem("ai-incorrect:selectedWrongOption", JSON.stringify(next2));
            return;
        }

        // Wrong answer selected: track attempt and highlight button with red background
        const nextWrong = {
            ...wrongSelections,
            [activeCase.id]: {
                ...(wrongSelections[activeCase.id] || {}),
                [selectedOptionId]: true,
            },
        };
        setWrongSelections(nextWrong);
        sessionStorage.setItem("ai-incorrect:wrongSelections", JSON.stringify(nextWrong));
        // Store current selection to highlight red CSS class on button
        const nextSelected = { ...selectedWrongOption, [activeCase.id]: selectedOptionId };
        setSelectedWrongOption(nextSelected);
        sessionStorage.setItem("ai-incorrect:selectedWrongOption", JSON.stringify(nextSelected));
    };

    // Submit reply: mark case complete in sessionStorage and close modal to show ECHO's response
    const handleSendReply = () => {
        if (!activeCase || !canSendReply) return;
        // Record that player submitted their community response for this case
        const next = { ...sentReplies, [activeCase.id]: true };
        setSentReplies(next);
        sessionStorage.setItem("ai-incorrect:sentReplies", JSON.stringify(next));
        setActiveCaseId(null); // Close modal
    };

   

    return (
        <>
        
            <div className="app-container">
                <Navbar />

                <main className="feed ai-incorrect-feed">
                    <div className="ai-incorrect-uses-page">
                        <section className="ai-incorrect-panel">
                            <div className="ai-incorrect-panel-header">
                                <header className="ai-incorrect-header">
                                    <h1>{t("aiIncorrectUsesPage.title")}</h1>
                                    <p>{t("aiIncorrectUsesPage.subtitle")}</p>
                                </header>
                                <p className="ai-incorrect-instruction">{t("aiIncorrectUsesPage.instruction")}</p>
                            </div>

                            <div className="ai-incorrect-list">
                                {/* Map through shuffled AI misuse cases and display each as a card */}
                                {challengeCases.map((item) => (
                                    <article key={item.id} className="ai-incorrect-post-card list-item">
                                        {/* Case avatar image */}
                                        <div className="x-avatar">
                                            <img src={assetPath(item.post?.image || echoOfficialUser?.avatarURL)} alt={item.post.name} />
                                        </div>
                                        <div className="x-post-main">
                                            {/* Display case metadata: author name, handle, and post date */}
                                            <div className="ai-incorrect-post-meta">
                                                <span className="ai-incorrect-post-name">{item.post.name}</span>
                                                <span className="ai-incorrect-post-handle">{item.post.handle}</span>
                                                <span className="ai-incorrect-post-handle">{formatDate(item.post.date)}</span>
                                            </div>
                                            <p className="ai-incorrect-post-text">{item.post.text}</p>
                                            {/* Display case image if present */}
                                            {item.post?.postImage && (
                                                <div className="ai-incorrect-post-image-wrap">
                                                    <img className="ai-incorrect-post-image" src={assetPath(item.post.postImage)} alt={item.post.name} />
                                                </div>
                                            )}
                                            {/* Show ECHO's official community response if player submitted their reply */}
                                            {sentReplies[item.id] && (
                                                <div className="thread-reply-card">
                                                    <div className="x-avatar reply-avatar">
                                                        <img
                                                            src={assetPath(echoOfficialUser?.avatarURL)}
                                                            alt={"ECHO"}
                                                        />
                                                    </div>
                                                    <div className="x-post-main">
                                                        <div className="ai-incorrect-post-meta">
                                                            <span className="ai-incorrect-post-name">
                                                                {t("officialAccount.name") || "ECHO Official Account"}
                                                            </span>
                                                            <span className="ai-incorrect-post-handle">
                                                                {t("officialAccount.handle") || "@ECHO"}
                                                            </span>
                                                        </div>
                                                        {/* Display correct response option as ECHO's community note */}
                                                        <p className="ai-incorrect-post-text">
                                                            {item.options.find((opt) => opt.isCorrect)?.text || ""}
                                                        </p>
                                                        <p className="ai-incorrect-sent">{t("aiIncorrectUsesPage.sent")}</p>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="post-actions-bar">
                                                {/* Reply button: opens modal with multiple choice options for this case */}
                                                <button
                                                    type="button"
                                                    className="reply-open-btn"
                                                    onClick={() => {
                                                        // Send xAPI "experienced" event documenting that player viewed this case
                                                        sendStatement(
                                                            XAPI_VERBS.EXPERIENCED,
                                                            {
                                                                id: `${ECHO_ACTIVITIES.PUZZLE_3.id}/case/${item.id}`,
                                                                definition: {
                                                                    name: { en: `View AI Incorrect Use Case ${item.id}` },
                                                                    type: "http://adlnet.gov/expapi/activities/assessment",
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
                                                        // Open modal for this case
                                                        setActiveCaseId(item.id);
                                                        // Reset wrong selection highlight when opening new case
                                                        setSelectedWrongOption((prev) => ({ ...prev, [item.id]: null }));
                                                    }}
                                                >
                                                    💬 {t("aiIncorrectUsesPage.reply")}
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>
                    </div>
                </main>

                {/* Stats sidebar with challenge progress badge */}
                <aside className="stats-sidebar">
                    <StatsPanel />
                </aside>
            </div>

            {/* Modal overlay: display when player clicks reply button on a case */}
            {activeCase && (
                <div className="reply-modal-backdrop" onClick={() => setActiveCaseId(null)}>
                    <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
                        {/* Modal close button */}
                        <button className="reply-modal-close" type="button" onClick={() => setActiveCaseId(null)}>
                            ×
                        </button>

                        {/* Show original post from the AI misuse case at top of modal */}
                        <article className="ai-incorrect-post-card x-post modal-top-post">
                            <div className="x-avatar">
                                <img src={assetPath(activeCase.post?.image || echoOfficialUser?.avatarURL)} alt={activeCase.post.name} />
                            </div>
                            <div className="x-post-main">
                                <div className="ai-incorrect-post-meta">
                                    <span className="ai-incorrect-post-name">{activeCase.post.name}</span>
                                    <span className="ai-incorrect-post-handle">{activeCase.post.handle}</span>
                                    <span className="ai-incorrect-post-handle">{formatDate(activeCase.post.date)}</span>
                                </div>
                                <p className="ai-incorrect-post-text">{activeCase.post.text}</p>
                                {activeCase.post?.postImage && (
                                    <div className="ai-incorrect-post-image-wrap">
                                        <img className="ai-incorrect-post-image" src={assetPath(activeCase.post.postImage)} alt={activeCase.post.name} />
                                    </div>
                                )}
                            </div>
                        </article>

                        <div className="x-reply-section modal-reply">
                            {/* ECHO moderator avatar */}
                            <div className="x-avatar moderator">
                                <img
                                    src={assetPath(activeCase.officialPost?.image || echoOfficialUser?.avatarURL)}
                                    alt={echoOfficialUser?.firstName || "ECHO"}
                                />
                            </div>
                            <div className="x-reply-main">
                                {/* Moderator name and handle */}
                                <div className="ai-incorrect-reply-meta">
                                    <strong>
                                        {activeCase.officialPost?.name ||
                                            `${echoOfficialUser?.firstName || ""} ${echoOfficialUser?.lastName || ""}`.trim()}
                                    </strong>&nbsp;&nbsp;
                                    <span>
                                        {activeCase.officialPost?.handle ||
                                            `@${echoOfficialUser?.username || "ECHO"}`}
                                    </span>&nbsp;&nbsp;
                                    <span className="ai-incorrect-post-handle">{formatDate(activeCase.post.date)}</span>
                                </div>
                                <p className="x-reply-helper">{t("aiIncorrectUsesPage.instruction")}</p>

                                {/* Multiple choice options for this case */}
                                <div className="ai-incorrect-options">
                                    {activeCaseOptions.map((option) => (
                                        <button
                                            key={option.optionId}
                                            /* CSS classes: 
                                               - wrong-selection: current wrong attempt (red background)
                                               - correct-selection: user selected correct answer (green background)
                                               - persist-wrong: previously tried wrong answer (light red background)
                                            */
                                            className={`ai-incorrect-option ${
                                                selectedWrongOption[activeCase.id] === option.optionId ? "wrong-selection" : ""
                                            } ${option.isCorrect && correctSelected[activeCase.id] ? "correct-selection" : ""} ${
                                                activeWrongSelections[option.optionId] ? "persist-wrong" : ""
                                            }`}
                                            onClick={() => handleOptionClick(option.optionId)}
                                            type="button"
                                        >
                                            {option.text}
                                        </button>
                                    ))}
                                </div>

                                {/* Feedback line: shows "try again" if wrong, "correct" if correct answer selected */}
                                <div className="reply-status-line">
                                    {!canSendReply && selectedWrongOption[activeCase.id] !== null && (
                                        <span className="reply-try-again">{t("aiIncorrectUsesPage.tryAgain")}</span>
                                    )}
                                    {canSendReply && (
                                        <span className="reply-correct">{t("aiIncorrectUsesPage.correct")}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="reply-modal-actions">
                            {/* Send reply button: disabled until correct answer is selected */}
                            <button type="button" className="reply-send-btn" disabled={!canSendReply} onClick={handleSendReply}>
                                {t("aiIncorrectUsesPage.reply")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Completion modal: shown briefly when all 3 cases are completed */}
            {showCompletionModal && (
                <div className="challenge-completion-overlay">
                    <div className="challenge-completion-modal">
                        <div className="challenge-completion-icon">🎉</div>
                        <h3 className="challenge-completion-title">{t("aiIncorrectUsesPage.challengeCompleted")}</h3>
                        <p className="challenge-completion-desc">{t("aiIncorrectUsesPage.challengeCompletedMsg")}</p>
                        <button className="challenge-completion-close" onClick={handleCompletionClose}>
                            {t("desktop.window.close")}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
