import React from "react";
// Import close icon from utilities
import { IoMdClose } from "../../utils/icons.jsx";

/**
 * EmojiModal Component
 * 
 * Renders a modal with a grid of emojis for users to select from.
 * When an emoji is clicked, it appends the emoji to the post content
 * and automatically closes the modal.
 * 
 * @param {boolean} showEmojiModal - Controls whether the modal is displayed
 * @param {function} setShowEmojiModal - Callback function to toggle modal visibility
 * @param {function} setPostForm - Function to update the post form with selected emoji
 * 
 * @returns {JSX.Element|null} The emoji picker modal or null if not visible
 */
export const EmojiModal = ({
  showEmojiModal,
  setShowEmojiModal,
  setPostForm,
}) => {
  /**
   * Array of emojis available for selection
   * Includes various emotion and expression emojis
   */
  const emojis = [
    "😀",
    "😁",
    "😅",
    "😂",
    "😇",
    "😎",
    "😍",
    "🤩",
    "🥺",
    "😘",
    "😛",
    "🥳",
    "🤣",
    "👻",
    "👍🏻",
    "😤",
    "🥶",
    "🤭",
    "🫣",
    "🤬",
    "🫠",
    "🫤",
    "🤯",
  ];

  // Only render the modal if showEmojiModal is true
  return (
    showEmojiModal && (
      /* Main modal container with overlay */
      <div className="emoji-modal-container">
        {/* Modal body wrapper */}
        <div className="modal-emoji-body">
          {/* Container for emoji grid and close button */}
          <div className="emoji-body-container">
            {/* Close button to dismiss the modal */}
            <IoMdClose
              onClick={() => {
                setShowEmojiModal(false);
              }}
              className="close-emoji-model"
            />
            {/* Grid of selectable emojis */}
            <div className="emojis">
              {/* Map through emojis array and render each as clickable span */}
              {emojis.map((emoji) => (
                <span
                  onClick={(e) => {
                    // Append selected emoji to post content
                    setPostForm((prev) => ({
                      ...prev,
                      content: prev.content + e.target.innerText,
                    }));
                    // Close the modal after selection
                    setShowEmojiModal(false);
                  }}
                  key={emoji}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  );
};
