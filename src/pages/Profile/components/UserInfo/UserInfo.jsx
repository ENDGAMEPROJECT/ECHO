// React
import React from "react";
// Multi-language support
import { useTranslation } from 'react-i18next';
// Context providers: user state and all users data
import { useUser } from "../../../../contexts/UserProvider.jsx";
// Utilities: localized content, date formatting, asset path resolution
import { getLocalizedContent } from '../../../../utils/i18nHelpers.jsx';
import { createdOnDate } from '../../../../utils/date.jsx';
import { assetPath } from "../../../../utils/assetPath";

/**
 * UserInfo: displays user profile with classification controls (for admin puzzle)
 * Features: ECHO official profile or user from database, misinformation classification UI, quiz
 * Used in: Profile page for both regular and admin game mode
 */
export const UserInfo = ({ username, showClassificationControls = false, selectedClassification, onClassify, isClassificationLocked = false, canOpenClassificationQuiz = false, onOpenClassificationQuiz, isQuizCompleted = false }) => {
  // Multi-language support and current language
  const { t, i18n } = useTranslation();
  // User state: all users in database
  const { userState } = useUser();

  // Check if this is the ECHO official account (special case)
  const isEchoProfile = username === "ECHO";

  // Get user data: ECHO has fixed data, regular users fetched from database
  const user = isEchoProfile
    ? {
        _id: "echo-official",
        firstName: t("officialAccount.name"),
        lastName: "",
        username: "ECHO",
        bio: t("officialAccount.bio", ""),
        avatarURL: "/assets/echo-logo-bg.png",
        verified: true,
        stats: { followersCount: "7.25M", followingCount: 0, postsCount: "500+" },
      }
    : userState?.allUsers?.find((u) => u.username === username) || null;
  // Exit early if user not found
  if (!user) return null;

  // Classification state machine for admin puzzle
  // Expected classification: 'yes' if bot, 'no' if human
  const expectedClassification = user?.puzzle?.isBot ? 'yes' : 'no';
  // Has user selected a classification
  const hasClassification = selectedClassification === 'yes' || selectedClassification === 'no';
  // User selected wrong classification
  const isIncorrectClassification = hasClassification && selectedClassification !== expectedClassification;
  // User correctly identified human (no quiz required)
  const isCorrectHumanClassification = hasClassification && selectedClassification === 'no' && expectedClassification === 'no';
  // User correctly identified bot AND completed quiz
  const isCorrectBotClassification = hasClassification && selectedClassification === 'yes' && expectedClassification === 'yes' && isQuizCompleted;

  return (
    <div className="user-info-container">
      {/* Profile header: avatar + optional classification controls */}
      <div className="profile-header-row">
        {/* User avatar image */}
        <div className="profilepicture-container">
          <img src={assetPath(user.avatarURL)} alt={user.firstName} 
          className={isEchoProfile ? "echo-logo" : ""}/>
        </div>
        {/* Classification controls: shown only in admin mode and not for ECHO profile */}
        {showClassificationControls && !isEchoProfile && (
          <div className="profile-classification-panel--pulse">
            {/* Classification question: "Is this account misinfo?" */}
            <p className="profile-classification-question">
              {t('profile.misinfoQuestion')}
            </p>
            {/* Yes/No buttons for classification */}
            <div className="profile-classification-buttons">
              {/* Yes button: mark as bot/misinfo */}
              <button
                className={`btn-yes ${selectedClassification === 'yes' ? 'selected' : ''}`}
                disabled={isClassificationLocked}
                onClick={() => onClassify?.('yes')}
              >
                {t('profile.yes')}
              </button>
              {/* No button: mark as human/legit */}
              <button
                className={`btn-no ${selectedClassification === 'no' ? 'selected' : ''}`}
                disabled={isClassificationLocked}
                onClick={() => onClassify?.('no')}
              >
                {t('profile.no')}
              </button>
            </div>

            {/* Open quiz button: shown when bot classification selected but quiz not completed */}
            {canOpenClassificationQuiz && (
              <button
                type="button"
                className="profile-open-quiz-button"
                onClick={onOpenClassificationQuiz}
              >
                {t('profile.openQuiz')}
              </button>
            )}

            {/* Error feedback: incorrect classification */}
            {isIncorrectClassification && (
              <p className="profile-classification-feedback profile-classification-feedback--error">
                {t('profile.classificationIncorrect')}
              </p>
            )}

            {/* Success feedback: correctly identified human */}
            {isCorrectHumanClassification && (
              <p className="profile-classification-feedback profile-classification-feedback--success">
                {t('profile.classificationCorrectHuman')}
              </p>
            )}

            {/* Success feedback: correctly identified bot with quiz completion */}
            {isCorrectBotClassification && (
              <p className="profile-classification-feedback profile-classification-feedback--success">
                {t('profile.classificationCorrectBot')}
              </p>
            )}
          </div>
        )}
      </div>
      {/* Username section: display name, verified badge, automation label */}
      <div className="username-container">
        {/* User name with optional verified badge */}
        <p className="name">
          {user.firstName}{user.lastName ? ` ${user.lastName}` : ""}
          {user.verified && (
            <img
              src={assetPath("/assets/verified_badge.png")}
              alt={t('profile.verifiedAccount')}
              className="verified-badge"
              title={t('profile.verifiedAccount')}
            />
          )}
        </p>
        <div className="username-row">
          {/* Username handle: show official or @username */}
          <p className="username">
            {isEchoProfile ? t("officialAccount.handle") : `@${user.username}`}
          </p>
          {/* Bot/automation indicator: shows robot emoji and label if classified as bot */}
          {!isEchoProfile && selectedClassification === 'yes' && isClassificationLocked && (
            <p className="profile-automation-label" title={t('admin.suspectUsers')}>
              <span aria-hidden="true">🤖</span>
              <span>{t('admin.suspectUsers')}</span>
            </p>
          )}
        </div>
      </div>
      {/* Bio section: display user biography and join date */}
      <div className="bio-container">
        {/* Bio text: localized for non-ECHO, fixed for ECHO */}
        <p>{isEchoProfile ? user.bio : getLocalizedContent(user.bio, i18n.language)}</p>
        {/* Join date: shown only for regular users */}
        {!isEchoProfile && user.createdAt && (
          <p className="joined-date"> {t('profile.joined')} {createdOnDate(user, i18n.language)}</p>
        
        )}
      </div>
      {/* Stats section: posts, following, followers counts */}
      <div className="post-followers-following-container">
        {/* Posts count */}
        <p>
          {user.stats?.postsCount ?? 0}
          <span>{t('profile.posts')}</span>
        </p>
        {/* Following count */}
        <p className="post-following-count">
          {user.stats?.followingCount ?? 0}
          <span>{t('profile.following')}</span>
        </p>
        {/* Followers count */}
        <p className="post-follower-count">
          {user.stats?.followersCount ?? 0}
          <span>{t('profile.followers')}</span>
        </p>
      </div>
    </div>
  );
};
