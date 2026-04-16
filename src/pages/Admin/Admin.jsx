import "./Admin.css";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import { useUser } from "../../contexts/UserProvider.jsx";
import { useLoggedInUser } from "../../contexts/LoggedInUserProvider.jsx";
import { useStats } from "../../contexts/StatsProvider.jsx";
import { useMessages } from "../../contexts/MessagesProvider.jsx";
import { useXAPI, XAPI_VERBS, ECHO_ACTIVITIES } from "../../contexts/XAPIProvider.jsx";
import { useOS } from "../../contexts/OSProvider.jsx";
import { Navbar } from "../../components/Navbar/Navbar";
import { StatsPanel } from "../../components/StatsPanel/StatsPanel";
import { RxInfoCircled } from "../../utils/icons.jsx";
import { assetPath } from "../../utils/assetPath";

const CLASSIFICATION = {
    YES: 'yes',
    NO: 'no',
};

const normalizeClassification = (value) => {
    if (value === 'AI') return CLASSIFICATION.YES;
    if (value === 'Humano') return CLASSIFICATION.NO;
    return value;
};

/**
 * Challenge 1 (Bot Detection) game page.
 * Players classify 5 randomly selected users (3 bots + 2 humans).
 * Correct classifications unlock a quiz. Perfect score completes the challenge.
 */
export const Admin = () => {
    const { t } = useTranslation();
    const { userState } = useUser();
    const { reduceMisinformation, completeChallenge1, challenge1Completed, setSuspectUsersCount, setChallenge1Progress } = useStats();
    const { addMessage } = useMessages();
    const { sendStatement, trackChallengeStarted } = useXAPI();
    const navigate = useNavigate();
    // User classifications: { username: 'yes'|'no' } restored from sessionStorage on reload
    const [classifiedUsers, setClassifiedUsers] = useState(() => {
        const saved = sessionStorage.getItem('adminGameState');
        if (!saved) return {};
        const parsed = JSON.parse(saved);
        return Object.fromEntries(
            Object.entries(parsed).map(([uname, classification]) => [uname, normalizeClassification(classification)])
        );
    });
    // Quiz submission map: { username: true } - true means bot user passed quiz
    const [quizSubmittedByUser, setQuizSubmittedByUser] = useState(() => {
        const saved = sessionStorage.getItem('adminGameQuizState');
        if (!saved) return {};

        try {
            const parsed = JSON.parse(saved);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch {
            return {};
        }
    });
    const [showHint, setShowHint] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [gameResult, setGameResult] = useState(null);
    const [isPerfectResult, setIsPerfectResult] = useState(false);
    const [isFirstVisit, setIsFirstVisit] = useState(() => !sessionStorage.getItem('echo:adminHintSeen:1'));
    // Prevents auto-submit from firing multiple times when all users are correctly classified
    const autoSubmitTriggeredRef = useRef(false);

    // Initialize challenge timer (fallback for direct URL access)
    useEffect(() => {
        if (challenge1Completed) return;
        if (!sessionStorage.getItem('echo:challengeStart:1')) {
            trackChallengeStarted('1', 'Puzzle 1 - Bot Detection');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleOpenHint = () => {
        setShowHint(true);
        if (isFirstVisit) {
            setIsFirstVisit(false);
            sessionStorage.setItem('echo:adminHintSeen:1', '1');
        }
    };

    const [suspectUsers, setSuspectUsers] = useState(() => []);

    // Randomly select 5 suspect users (3 bots + 2 humans). Persist by username so selection survives page reload
    useEffect(() => {
        if (challenge1Completed) {
            setSuspectUsers([]);
            return;
        }
        if (!userState?.allUsers?.length) return;

        // Try to restore previous selection from sessionStorage (key from usernames, not IDs which change in Mirage)
        const savedUsernames = sessionStorage.getItem('adminGameUsernames');
        if (savedUsernames) {
            try {
                const usernames = JSON.parse(savedUsernames);
                const restored = usernames
                    .map(uname => userState.allUsers.find(u => u.username === uname))
                    .filter(Boolean);
                if (restored.length === 5) {
                    setSuspectUsersCount(restored.length);
                    setSuspectUsers(restored);
                    return;
                }
            } catch (e) {
                console.error('Error restoring saved usernames:', e);
            }
        }

        // First visit: randomly select 3 bots and 2 humans
        const bots = userState.allUsers.filter(u => u.puzzle?.isBot === true);
        const humans = userState.allUsers.filter(u => u.puzzle?.isBot === false);

        const shuffledBots = [...bots].sort(() => Math.random() - 0.5);
        const shuffledHumans = [...humans].sort(() => Math.random() - 0.5);

        const selected = [
            ...shuffledBots.slice(0, 3),
            ...shuffledHumans.slice(0, 2),
        ].sort(() => Math.random() - 0.5);

        const selectedUsernames = selected.map(u => u.username);
        sessionStorage.setItem('adminGameUsernames', JSON.stringify(selectedUsernames));
        sessionStorage.removeItem('adminGameUsers');
        setSuspectUsersCount(selected.length);
        setSuspectUsers(selected);
    }, [userState?.allUsers, challenge1Completed]);

    // Save player's classifications to sessionStorage after each change
    useEffect(() => {
        sessionStorage.setItem('adminGameState', JSON.stringify(classifiedUsers));
    }, [classifiedUsers]);

    // Discard classifications for users no longer in the current game (in case Mirage reset changed user pool)
    useEffect(() => {
        if (suspectUsers.length > 0) {
            const currentUsernames = suspectUsers.map(u => u.username);
            const savedClassifications = Object.keys(classifiedUsers);
            const hasInvalidClassifications = savedClassifications.some(uname => !currentUsernames.includes(uname));
            if (hasInvalidClassifications) {
                const validClassifications = {};
                currentUsernames.forEach(uname => {
                    if (classifiedUsers[uname]) validClassifications[uname] = classifiedUsers[uname];
                });
                setClassifiedUsers(validClassifications);
                sessionStorage.setItem('adminGameState', JSON.stringify(validClassifications));
            }
        }
    }, [suspectUsers]);

    // Discard quiz submissions for users no longer in the game
    useEffect(() => {
        if (suspectUsers.length > 0) {
            const currentUsernames = suspectUsers.map(u => u.username);
            const savedQuizUsers = Object.keys(quizSubmittedByUser);
            const hasInvalidQuizUsers = savedQuizUsers.some(uname => !currentUsernames.includes(uname));

            if (hasInvalidQuizUsers) {
                const validQuizState = {};
                currentUsernames.forEach(uname => {
                    if (quizSubmittedByUser[uname]) validQuizState[uname] = true;
                });
                setQuizSubmittedByUser(validQuizState);
                sessionStorage.setItem('adminGameQuizState', JSON.stringify(validQuizState));
            }
        }
    }, [suspectUsers]);

    // Count correct classifications for navbar badge (bots must also pass quiz)
    useEffect(() => {
        if (suspectUsers.length === 0) return;
        const correctCount = suspectUsers.filter(user => {
            const classification = normalizeClassification(classifiedUsers[user.username]);
            const isBot = user?.puzzle?.isBot;
            const isClassificationCorrect =
                (classification === CLASSIFICATION.YES && isBot) ||
                (classification === CLASSIFICATION.NO && !isBot);
            if (!isClassificationCorrect) return false;
            // Bots: classification must be correct AND quiz passed
            if (isBot) return Boolean(quizSubmittedByUser[user.username]);
            return true;
        }).length;
        setChallenge1Progress(correctCount);
    }, [suspectUsers, classifiedUsers, quizSubmittedByUser, setChallenge1Progress]);

    // Validate classification: correct label + quiz passed if bot
    const isCorrectClassification = (user) => {
        const classification = normalizeClassification(classifiedUsers[user.username]);
        const isBot = user?.puzzle?.isBot;
        const isClassificationCorrect =
            (classification === CLASSIFICATION.YES && isBot) ||
            (classification === CLASSIFICATION.NO && !isBot);

        if (!isClassificationCorrect) return false;

        // Bots also need quiz pass; humans only need correct classification
        if (isBot) {
            return Boolean(quizSubmittedByUser[user.username]);
        }

        return true;
    };

    // Navigate to user profile with game state marker
    const handleProfileClick = (username) => {
        sessionStorage.setItem('fromAdmin', 'true');
        navigate(`/profile/${username}`);
    };

    const allUsersCorrectlyClassified =
        suspectUsers.length > 0 &&
        suspectUsers.every((user) => {
            const classification = classifiedUsers[user.username];
            if (!classification) return false;
            return isCorrectClassification(user);
        });

    // Auto-submit when all 5 users are correctly classified (flag prevents firing twice)
    useEffect(() => {
        if (challenge1Completed) return;

        if (!allUsersCorrectlyClassified) {
            autoSubmitTriggeredRef.current = false;
            return;
        }

        if (autoSubmitTriggeredRef.current) return; // Already triggered this render cycle
        autoSubmitTriggeredRef.current = true;
        handleSubmit();
    }, [allUsersCorrectlyClassified, challenge1Completed]);

    // Evaluate all classifications and send xAPI statements (succeeded/failed)
    const handleSubmit = () => {
        let correct = 0;
        let incorrect = 0;

        suspectUsers.forEach(user => {
            const userClassification = normalizeClassification(classifiedUsers[user.username]);
            const isBot = user.puzzle?.isBot;

            if ((userClassification === CLASSIFICATION.YES && isBot) || (userClassification === CLASSIFICATION.NO && !isBot)) {
                correct++;
            } else {
                incorrect++;
            }
        });

        const isPerfect = correct === suspectUsers.length;
        const scaledScore = suspectUsers.length > 0 ? correct / suspectUsers.length : 0;

        setGameResult({ correct, incorrect, total: suspectUsers.length });
        setShowResult(true);

        // Perfect score: mark challenge complete, reduce misinformation, send xAPI succeeded+completed
        if (isPerfect) {
            setIsPerfectResult(true);
            // Only send xAPI once per challenge (dedup key prevents double-send on render)
            const completedKey1 = 'echo:challengeCompleted:1';
            if (!sessionStorage.getItem(completedKey1)) {
                sessionStorage.setItem(completedKey1, '1');

                const context1 = {
                    contextActivities: {
                        parent: [ECHO_ACTIVITIES.PUZZLE_1],
                        grouping: [ECHO_ACTIVITIES.GAME],
                    },
                };

                // Send "succeeded" with score: raw count and scaled (0-1)
                sendStatement(
                    XAPI_VERBS.SUCCEEDED,
                    ECHO_ACTIVITIES.PUZZLE_1,
                    {
                        success: true,
                        completion: true,
                        score: { scaled: scaledScore, raw: correct, min: 0, max: suspectUsers.length },
                    },
                    context1
                );

                // Send "completed" with total time taken (don't clear start time yet for retries)
                const startRaw1 = sessionStorage.getItem('echo:challengeStart:1');
                const completedResult1 = { completion: true };
                if (startRaw1 && Number.isFinite(Number(startRaw1))) {
                    const durationMs1 = Date.now() - Number(startRaw1);
                    completedResult1.duration = `PT${Math.max(0, Math.round(durationMs1 / 1000))}S`;
                    completedResult1.extensions = { "https://endgameproject.github.io/xapi/ext/durationMs": durationMs1 };
                }
                sessionStorage.removeItem('echo:challengeStart:1');
                sendStatement(XAPI_VERBS.COMPLETED, ECHO_ACTIVITIES.PUZZLE_1, completedResult1, context1);
            }
        } else {
            // Fail: send failed statement with duration. Keep start time so retries accumulate time
            const startRaw = sessionStorage.getItem('echo:challengeStart:1');
            const failResult = {
                success: false,
                completion: false,
                score: { scaled: scaledScore },
            };
            if (startRaw && Number.isFinite(Number(startRaw))) {
                const durationMs = Date.now() - Number(startRaw);
                failResult.duration = `PT${Math.max(0, Math.round(durationMs / 1000))}S`;
            }
            sendStatement(
                XAPI_VERBS.FAILED,
                ECHO_ACTIVITIES.PUZZLE_1,
                failResult,
                {
                    contextActivities: {
                        parent: [ECHO_ACTIVITIES.GAME],
                        grouping: [ECHO_ACTIVITIES.GAME],
                    },
                }
            );
        }
    };

    // Close modal (retry) or complete challenge (perfect score sends Challenge 2 message)
    const handleTryAgain = () => {
        setShowResult(false);
        setGameResult(null);
        autoSubmitTriggeredRef.current = false;
        if (isPerfectResult) {
            setIsPerfectResult(false);
            reduceMisinformation(30); // Decrease misinformation stat in StatsPanel
            completeChallenge1(); // Mark challenge 1 as completed in stats
            // Wipe all game state from sessionStorage
            sessionStorage.removeItem('adminGameUsernames');
            sessionStorage.removeItem('adminGameState');
            sessionStorage.removeItem('adminGameQuizState');
            sessionStorage.removeItem('fromAdmin');
            setClassifiedUsers({});
            setQuizSubmittedByUser({});
            // Queue Challenge 2 instructions message
            sessionStorage.setItem("challenge2InstructionsSent", JSON.stringify(true));
            addMessage({
                fromKey: "messagesApp.author.name",
                subjectKey: "messagesApp.messages.challenge2.subject",
                contentKey: "messagesApp.messages.challenge2.content",
            });
            // Notify UI to show message drawer and boss message event
            window.dispatchEvent(new Event("openDrawer"));
            window.dispatchEvent(new Event("bossMessage"));
        }
    };

    return (
        <>

            <div className="app-container">
                <Navbar />

                <main className="feed">
                    <div className="admin-container">
                        <div className="admin-header">
                            <h2>{t('admin.title')}</h2>
                        </div>

                        <div className="game-status">
                            <p>{t('admin.classified')}: {Object.keys(classifiedUsers).length} / {suspectUsers.length}</p>
                            <button className={`hint-button ${isFirstVisit ? 'hint-button--pulse' : ''}`} onClick={handleOpenHint}>
                                {t('admin.beforeStart')}
                            </button>
                        </div>

                        <div className="suspect-users-container">
                            {suspectUsers?.length ? (
                                suspectUsers?.map((user) => (
                                    <div
                                        key={user?.username}
                                        className="suspect-user-card"
                                    >
                                        <div
                                            onClick={() => handleProfileClick(user.username)}
                                            className="suspect-user-img-container"
                                        >
                                            <img src={assetPath(user?.avatarURL)} alt={user?.firstName} />
                                        </div>
                                        <div
                                            className="user-info"
                                            onClick={() => handleProfileClick(user.username)}
                                        >
                                            <p className="name">
                                                {user?.firstName} {user?.lastName}
                                                {user?.verified && (
                                                    <img
                                                        src={assetPath("/assets/verified_badge.png")}
                                                        alt={t('profile.verifiedAccount')}
                                                        className="verified-badge"
                                                        title={t('profile.verifiedAccount')}
                                                    />
                                                )}
                                            </p>
                                            <p className="username">@{user?.username}</p>
                                        </div>
                                        {isCorrectClassification(user) && (
                                            <div className="classification-status" title={t('profile.classificationCorrectHuman')}>
                                                <span aria-hidden="true">✓</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="no-suspects">{t('admin.noSuspects')}</p>
                            )}
                        </div>
                    </div>
                </main>

                {/* Panel de estadísticas lateral */}
                <aside className="stats-sidebar">
                    <StatsPanel />
                </aside>
            </div>

            {showHint && (
                <div className="hint-modal-overlay" onClick={() => setShowHint(false)}>
                    <div className="hint-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="hint-modal-header">
                            <div className="hint-modal-title">
                              
                                <RxInfoCircled style={{ marginTop: '0.2rem', fontSize: '1.25rem', minWidth: "1rem", aspectRatio: "1/1" }} />
                                <h3>{t('admin.hintTitle')}</h3>
                            </div>    
                                <button className="close-button" onClick={() => setShowHint(false)}>×</button>
                            

                        </div>
                        <div className="hint-modal-content">
                            <ul>
                                <li><strong>{t('admin.hintContent.emotions').split(':')[0]}:</strong> {t('admin.hintContent.emotions').split(':')[1]}</li>
                                <li><strong>{t('admin.hintContent.targetAudience').split(':')[0]}:</strong> {t('admin.hintContent.targetAudience').split(':')[1]}</li>
                                <li><strong>{t('admin.hintContent.temporalActivity').split(':')[0]}:</strong> {t('admin.hintContent.temporalActivity').split(':')[1]}</li>
                                <li><strong>{t('admin.hintContent.abnormalRatio').split(':')[0]}:</strong> {t('admin.hintContent.abnormalRatio').split(':')[1]}</li>
                                <li><strong>{t('admin.hintContent.recentAccount').split(':')[0]}:</strong> {t('admin.hintContent.recentAccount').split(':')[1]}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {showResult && gameResult && (
                <div className="challenge-completion-overlay">
                    <div className="challenge-completion-modal">
                        <div className="challenge-completion-icon">
                            {isPerfectResult ? '🎉' : '❌'}
                        </div>
                        <h3 className="challenge-completion-title">
                            {isPerfectResult ? t('admin.perfectScore') : t('admin.resultTitle')}
                        </h3>
                        <p className="challenge-completion-desc">
                            {isPerfectResult ? t('admin.allCorrect') : t('admin.tryAgain')}
                        </p>
                        <p className="challenge-completion-desc">
                            {t('admin.score')}: {gameResult.correct} / {gameResult.total}
                        </p>
                        <button className={`challenge-completion-close${isPerfectResult ? '' : ' challenge-completion-close--error'}`} onClick={handleTryAgain}>
                            {isPerfectResult ? t('desktop.window.close') : t('admin.playAgain')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
