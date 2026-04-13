import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFeather } from "../../utils/icons.jsx";
import { CreatePostForm } from "../../components/CreatePostForm/CreatePostForm";
import { CommunityNote } from "../CommunityNote/CommunityNote.jsx";
import { useStats } from "../../contexts/StatsProvider.jsx";
import { useXAPI } from "../../contexts/XAPIProvider.jsx";
import { PopupNotification } from "../../components/PopupNotification/PopupNotification";

export const NewPostLauncher = () => {
  const { t } = useTranslation();
  const {
    challenge1Completed,
    challenge2Completed,
    challenge3Completed,
    challengeFinalCompleted,
    challengeFinalInstructionsRead,
  } = useStats();
  const { trackChallengeStarted } = useXAPI();
  const [isCreateNewPostClicked, setIsCreateNewPostClicked] = useState(false);
  const [popup, setPopup] = useState({
    visible: false,
    message: "",
    position: { top: 0, left: 0 },
  });

  let lockMessageKey = null;
  if (!challenge1Completed || !challenge2Completed || !challenge3Completed) {
    lockMessageKey = "desktop.popup.completeAllChallenges";
  } else if (!challengeFinalCompleted && !challengeFinalInstructionsRead) {
    lockMessageKey = "desktop.popup.readMessageChallengeFinal";
  }

  const isLocked = Boolean(lockMessageKey);
  const shouldShowCommunityNote = challenge3Completed && !challengeFinalCompleted;
  const shouldPulseNewPost = shouldShowCommunityNote && !isLocked;

  const handleButtonClick = (event) => {
    if (!isLocked) {
      if (shouldShowCommunityNote && !sessionStorage.getItem('echo:challengeStart:4')) {
        trackChallengeStarted('4', 'Puzzle 4 - Community Note');
      }
      setIsCreateNewPostClicked((prev) => !prev);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 280;
    setPopup({
      visible: true,
      message: t(lockMessageKey),
      position: {
        top: Math.max(50, rect.top - 60),
        left: Math.max(10, rect.left + rect.width / 2 - popupWidth / 2),
      },
    });
  };

  return (
    <>
      <button
        className={`create-new-post-btn ${isLocked ? "is-locked" : ""} ${(challenge3Completed && !challengeFinalCompleted && challengeFinalInstructionsRead) ? "hint-button--pulse" : ""}`}
        onClick={handleButtonClick}
        type="button"
        aria-disabled={isLocked}
      >
        <FaFeather className="feather-icon" />
        <span>{t("nav.newPost")}</span>
      </button>
      {isCreateNewPostClicked && (
        <div className="create-post-modal">
          {shouldShowCommunityNote ? (
            <CommunityNote setIsCreateNewPostClicked={setIsCreateNewPostClicked} />
          ) : (
            <CreatePostForm
              className="modal-content"
              setIsCreateNewPostClicked={setIsCreateNewPostClicked}
            />
          )}
        </div>
      )}
      {popup.visible && (
        <PopupNotification
          message={popup.message}
          position={popup.position}
          onClose={() => setPopup((prev) => ({ ...prev, visible: false }))}
          duration={800}
        />
      )}
    </>
  );
};
