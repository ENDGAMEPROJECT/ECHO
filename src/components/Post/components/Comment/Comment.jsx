import "./Comment.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { RxDotsHorizontal } from "react-icons/rx";
import { useTranslation } from 'react-i18next';
import { getLocalizedContent } from '../../../../utils/i18nHelpers.jsx';

import { usePosts } from "../../../../contexts/PostsProvider.jsx";
import { useLoggedInUser } from "../../../../contexts/LoggedInUserProvider.jsx";
import { useUser } from "../../../../contexts/UserProvider.jsx";
import { assetPath } from "../../../../utils/assetPath";

/**
 * Comment Component
 * 
 * Displays a single comment on a post with user information
 * Features:
 * - User avatar, name, and username display
 * - Comment text with localization support
 * - Admin-only toolbar with edit/delete options
 * - In-place comment editing for comment owner
 * - Handles complex nested/array text formats
 * 
 * Admin capabilities:
 * - Delete any comment
 * - Edit only own comments (if owner)
 * 
 * @param {Object} comment - Comment object containing _id, username, avatarURL, firstName, lastName, text
 * @param {Object} post - Parent post object containing _id (used for delete/edit operations)
 * @returns {JSX.Element} Rendered comment card with user info and content
 */
export const Comment = ({ comment, post }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { userState } = useUser();
  const { _id, avatarURL, username, firstName, lastName, text } =
    comment;
  const { deleteComment, editComment } = usePosts();
  const [showCommentToolbar, setShowCommentToolbar] = useState(false);

  // State to track if comment is in edit mode
  const [isEditComment, setIsEditComment] = useState(false);
  // Logged in user context - check if current user is admin
  const { loggedInUserState } = useLoggedInUser();
  // Admin flag - determines if edit/delete toolbar is shown
  const isAdmin = loggedInUserState.isAdmin;

  /**
   * Normalizes various data types to string format
   * Handles: null, undefined, strings, numbers, booleans, arrays, and objects
   * For arrays: joins non-empty strings with space
   * For objects: extracts text, richText, or hyperlink properties
   * @param {*} value - Any data type to normalize to string
   * @returns {string} Normalized string or empty string
   */
  const normalizeText = (value) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") return String(value);
    if (Array.isArray(value)) {
      return value
        .map((item) => normalizeText(item))
        .filter(Boolean)
        .join(" ")
        .trim();
    }
    // Handle objects - extract known text properties
    if (typeof value === "object") {
      // Check for text property (common for rich text objects)
      if (value.text !== undefined) return normalizeText(value.text);
      // Check for richText property
      if (value.richText !== undefined) return normalizeText(value.richText);
      // Check for hyperlink property
      if (value.hyperlink !== undefined) return normalizeText(value.hyperlink);
      return "";
    }
    return "";
  };

  // State for editing - stores the edited comment text
  const [userComment, setUserComment] = useState({ text: text });

  // Normalize username - remove @ prefix and trim whitespace
  const normalizedUsername = normalizeText(username).replace(/^@/, "").trim();
  // Find user details from all users by matching normalized username
  const userDetails = userState?.allUsers?.find(
    (user) => (user?.username || "").replace(/^@/, "") === normalizedUsername
  );
  // Display username with @ prefix (or empty if not found)
  const displayUsername = normalizedUsername ? `@${normalizedUsername}` : "";
  // Display avatar - use user details avatar, fallback to comment avatar, final fallback to default
  const displayAvatar = userDetails?.avatarURL || normalizeText(avatarURL) || "/assets/users/TechAlex.png";
  // Display name - combine first and last name, fallback to username
  const displayName = `${firstName || ""} ${lastName || ""}`.trim() || displayUsername;
  // Display comment - get localized version if available, fallback to normalized text
  const displayComment = getLocalizedContent(text, i18n.language) || normalizeText(text) || "...";

  // Render comment card with user info and content
  return (
    <div className="comment-card">
      {/* User avatar section */}
      <div>
        <img
          className="comment-user-image"
          src={assetPath(displayAvatar)}
          alt={displayName || "User"}
        />
      </div>

      {/* Main comment content section */}
      <div className="comment-main-section">
        {/* Username and name container with admin toolbar */}
        <div className="username-container">
          {/* Display user's full name */}
          <p className="name">
            {displayName}
          </p>
          {/* Display user's username with @ prefix */}
          <span
            className="username"
          >
            {displayUsername}
          </span>{" "}
          {/* Admin-only toolbar for edit/delete options */}
          {isAdmin && (
            <div className="comment-toolbar">
              {/* Three-dot menu button to toggle toolbar visibility */}
              <div
                className="edit"
                onClick={() => setShowCommentToolbar(!showCommentToolbar)}
              >
                <RxDotsHorizontal className="three-dots-icon" />
              </div>
              {/* Dropdown menu with edit/delete options */}
              {showCommentToolbar && (
                <div className="comment-toolbar-menu-container">
                  {/* Edit option - only shown to comment owner */}
                  {loggedInUserState.username === username && (
                    <p
                      onClick={() => {
                        setIsEditComment(true);
                        setShowCommentToolbar(false);
                      }}
                    >
                      {t('comments.edit')}
                    </p>
                  )}
                  {/* Delete option - available to all admins */}
                  <p
                    onClick={() => {
                      deleteComment(post?._id, _id, "admin-token");
                    }}
                  >
                    {t('comments.delete')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comment content - either display mode or edit mode */}
        {!isEditComment ? (
          // Display mode - show comment text
          <div className="user-comment">{displayComment}</div>
        ) : (
          // Edit mode - textarea and save button
          <div className="edit-comment-container">
            <textarea
              onChange={(e) => setUserComment({ text: e.target.value })}
              value={userComment.text}
            />
            <button
              onClick={() => {
                editComment(post._id, _id, userComment, "admin-token");
                setIsEditComment(false);
              }}
            >
              {t('comments.save')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
