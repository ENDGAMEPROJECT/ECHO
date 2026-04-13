import React from "react";
import { useTranslation } from 'react-i18next';
import { useUser } from "../../../../contexts/UserProvider.jsx";
import { getLocalizedContent } from '../../../../utils/i18nHelpers.jsx';
import { createdOnDate } from '../../../../utils/date.jsx';
import { assetPath } from "../../../../utils/assetPath";

export const UserInfo = ({ username, showClassificationControls = false, selectedClassification, onClassify, isClassificationLocked = false, canOpenClassificationQuiz = false, onOpenClassificationQuiz, isQuizCompleted = false }) => {
  const { t, i18n } = useTranslation();
  const { userState } = useUser();

  const isEchoProfile = username === "ECHO";

  // Si es el perfil ECHO, usar datos fijos; si no, buscar en allUsers
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
  if (!user) return null;

  const expectedClassification = user?.puzzle?.isBot ? 'yes' : 'no';
  const hasClassification = selectedClassification === 'yes' || selectedClassification === 'no';
  const isIncorrectClassification = hasClassification && selectedClassification !== expectedClassification;
  const isCorrectHumanClassification = hasClassification && selectedClassification === 'no' && expectedClassification === 'no';
  const isCorrectBotClassification = hasClassification && selectedClassification === 'yes' && expectedClassification === 'yes' && isQuizCompleted;

  return (
    <div className="user-info-container">
      <div className="profile-header-row">
        <div className="profilepicture-container">
          <img src={assetPath(user.avatarURL)} alt={user.firstName} 
          className={isEchoProfile ? "echo-logo" : ""}/>
        </div>
        {showClassificationControls && !isEchoProfile && (
          <div className="profile-classification-panel--pulse">
            <p className="profile-classification-question">
              {t('profile.misinfoQuestion')}
            </p>
            <div className="profile-classification-buttons">
              <button
                className={`btn-yes ${selectedClassification === 'yes' ? 'selected' : ''}`}
                disabled={isClassificationLocked}
                onClick={() => onClassify?.('yes')}
              >
                {t('profile.yes')}
              </button>
              <button
                className={`btn-no ${selectedClassification === 'no' ? 'selected' : ''}`}
                disabled={isClassificationLocked}
                onClick={() => onClassify?.('no')}
              >
                {t('profile.no')}
              </button>
            </div>

            {canOpenClassificationQuiz && (
              <button
                type="button"
                className="profile-open-quiz-button"
                onClick={onOpenClassificationQuiz}
              >
                {t('profile.openQuiz')}
              </button>
            )}

            {isIncorrectClassification && (
              <p className="profile-classification-feedback profile-classification-feedback--error">
                {t('profile.classificationIncorrect')}
              </p>
            )}

            {isCorrectHumanClassification && (
              <p className="profile-classification-feedback profile-classification-feedback--success">
                {t('profile.classificationCorrectHuman')}
              </p>
            )}

            {isCorrectBotClassification && (
              <p className="profile-classification-feedback profile-classification-feedback--success">
                {t('profile.classificationCorrectBot')}
              </p>
            )}
          </div>
        )}
      </div>
      <div className="username-container">
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
          <p className="username">
            {isEchoProfile ? t("officialAccount.handle") : `@${user.username}`}
          </p>
          {!isEchoProfile && selectedClassification === 'yes' && isClassificationLocked && (
            <p className="profile-automation-label" title={t('admin.suspectUsers')}>
              <span aria-hidden="true">🤖</span>
              <span>{t('admin.suspectUsers')}</span>
            </p>
          )}
        </div>
      </div>
      <div className="bio-container">
        <p>{isEchoProfile ? user.bio : getLocalizedContent(user.bio, i18n.language)}</p>
        {!isEchoProfile && user.createdAt && (
          <p className="joined-date"> {t('profile.joined')} {createdOnDate(user, i18n.language)}</p>
        
        )}
      </div>
      <div className="post-followers-following-container">
        <p>
          {user.stats?.postsCount ?? 0}
          <span>{t('profile.posts')}</span>
        </p>
        <p className="post-following-count">
          {user.stats?.followingCount ?? 0}
          <span>{t('profile.following')}</span>
        </p>
        <p className="post-follower-count">
          {user.stats?.followersCount ?? 0}
          <span>{t('profile.followers')}</span>
        </p>
      </div>
    </div>
  );
};
