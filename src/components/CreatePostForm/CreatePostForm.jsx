import "./CreatePostForm.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';

// Import UI icons for the form
import { IoMdClose, VscSmiley, ImFilePicture } from "../../utils/icons.jsx";
// Import context hooks for user, posts, and stats data
import { useLoggedInUser } from "../../contexts/LoggedInUserProvider.jsx";
import { usePosts } from "../../contexts/PostsProvider.jsx";
import { useStats } from "../../contexts/StatsProvider.jsx";
// Import emoji picker modal component
import { EmojiModal } from "../EmojiModal/EmojiModal";
// Import utility function to resolve asset paths
import { assetPath } from "../../utils/assetPath";

/**
 * CreatePostForm Component
 * 
 * Renders a form for creating new posts with the following features:
 * - Text content input with textarea
 * - Media upload (images and videos) with validation
 * - Emoji picker support
 * - Challenge completion requirement to publish
 * - User profile integration
 * 
 * @param {function} setIsCreateNewPostClicked - Callback to close the form modal
 * @param {string} className - Optional CSS class name for styling
 * 
 * @returns {JSX.Element} The post creation form component
 */
export const CreatePostForm = ({ setIsCreateNewPostClicked, className }) => {
  // Get translation function for localized strings
  const { t } = useTranslation();
  // Get createPost function from posts context
  const { createPost } = usePosts();
  // Get logged-in user data from context
  const { loggedInUserState } = useLoggedInUser();
  // Get challenge completion status from stats context
  const { challenge1Completed } = useStats();
  // Get navigation function for redirecting to other pages
  const navigate = useNavigate();
  // Extract user name from logged-in user state
  const firstName = loggedInUserState?.firstName;
  const lastName = loggedInUserState?.lastName;
  // State for controlling emoji picker modal visibility
  const [showEmojiModal, setShowEmojiModal] = useState(false);
  // State for controlling challenge notification visibility
  const [showChallengeNotification, setShowChallengeNotification] = useState(false);

  /**
   * Post form state object containing:
   * - firstName, lastName: User information
   * - avatarURL: User profile picture URL
   * - content: Text content of the post
   * - mediaUrl: URL to the uploaded media (image or video)
   * - type: Type of media ('image' or 'video')
   */
  const [postForm, setPostForm] = useState({
    firstName,
    lastName,
    avatarURL: loggedInUserState?.avatarURL,
    content: "",
    mediaUrl: "",
  });

  /**
   * Handles media file input and validation
   * 
   * Validates:
   * - File type (only images and videos allowed)
   * - File size (maximum 20MB)
   * 
   * Creates object URL for preview before upload
   * 
   * @param {Event} e - Change event from file input
   */
  const handleMediaInput = (e) => {
    const file = e.target.files[0];
    // Check if file is an image or video
    if (file?.type.startsWith("image/") || file.type.startsWith("video/")) {
      // Validate file size does not exceed 20MB
      if (file.size < 20 * 1024 * 1024) {
        // Update form with media preview and type
        setPostForm((prev) => ({
          ...prev,
          mediaUrl: URL.createObjectURL(file),
          type: file?.type.startsWith("image/") ? "image" : "video",
        }));
      } else {
        // Show error toast if file is too large
        toast.error(t('createPost.fileTooBig'));
      }
    } else {
      // Show error toast if file type is not supported
      toast.error(t('createPost.invalidFileType'));
    }
  };

  /**
   * Synchronize user data with form when logged-in user state changes
   * Updates firstName, lastName, and avatarURL whenever user context changes
   */
  useEffect(() => {
    setPostForm((prev) => ({
      ...prev,
      firstName,
      lastName,
      avatarURL: loggedInUserState?.avatarURL,
    }));
  }, [loggedInUserState]);

  return (
    <>
      {/* Main form container for creating a new post */}
      <form
        onSubmit={(e) => {
          // Prevent default form submission behavior
          e.preventDefault();
          // Check if challenge 1 is completed before allowing post submission
          if (!challenge1Completed) {
            return; // Do nothing if challenge 1 is not completed
          }
          // Create new post with provided data and authentication token
          createPost(e, postForm, "admin-token");
          // Reset form to initial state after successful submission
          setPostForm({
            firstName: loggedInUserState?.firstName,
            lastName: loggedInUserState?.lastName,
            avatarURL: loggedInUserState?.avatarURL,
            content: "",
            mediaUrl: "",
          });
          // Close the post creation modal if callback provided
          setIsCreateNewPostClicked && setIsCreateNewPostClicked(false);
        }}
        className={`new-post-container ${className}`}
      >
        {/* User avatar section - clickable to navigate to user profile */}
        <div
          onClick={() => navigate(`/profile/${loggedInUserState?.username}`)}
          className="img-container "
        >
          <img
            className="echo-logo-create-post"
            src={assetPath(loggedInUserState.avatarURL)}
            alt={loggedInUserState.firstName}
          />
        </div>

        {/* Main input area containing text and media elements */}
        <div className="input-container">
          {/* Text content input section */}
          <div className="text-content-container">
            {/* Textarea for post content input */}
            <textarea
              onChange={(e) =>
                setPostForm((prev) => ({ ...prev, content: e.target.value }))
              }
              value={postForm.content}
              placeholder={t('createPost.placeholder')}
            />
            {/* Close button to dismiss the post creation modal */}
            {setIsCreateNewPostClicked && (
              <IoMdClose
                onClick={() => {
                  setIsCreateNewPostClicked && setIsCreateNewPostClicked(false);
                }}
                className="close-create-post-modal"
              />
            )}
          </div>

          {/* Media preview section for videos */}
          {postForm?.mediaUrl && postForm.type !== "image" && (
            <div className="media-container">
              <video muted loop>
                <source src={assetPath(postForm?.mediaUrl)} />
              </video>
              {/* Close button to remove video from post */}
              <IoMdClose
                onClick={() => {
                  setPostForm({ ...postForm, mediaUrl: "" });
                }}
                className="close-media"
              />
            </div>
          )}

          {/* Media preview section for images */}
          {postForm?.mediaUrl && postForm.type === "image" && (
            <div className="media-container">
              <img src={assetPath(postForm?.mediaUrl)} alt="" />
              {/* Close button to remove image from post */}
              <IoMdClose
                onClick={() => {
                  setPostForm({ ...postForm, mediaUrl: "" });
                }}
                className="close-media"
              />
            </div>
          )}

          {/* Toolbar and submit buttons container */}
          <div className="input-btn-container">
            {/* Toolbar with media and emoji picker buttons */}
            <div className="toolbar-container">
              {/* Media upload input label and input */}
              <label htmlFor="mediaForCreate">
                {" "}
                <ImFilePicture className="file-icon" />
              </label>
              <input
                onChange={handleMediaInput}
                type="file"
                id="mediaForCreate"
              />

              {/* Emoji picker button */}
              <VscSmiley
                className="smily-emoji"
                onClick={() => setShowEmojiModal(true)}
              />
            </div>
            {/* Submit button container */}
            <div className="post-btn-container">
              {/* Publish button - disabled if challenge not completed or no content/media */}
              <button
                disabled={!challenge1Completed || (!postForm.content && !postForm.mediaUrl)}
                type="submit"
              >
                {t('createPost.publish')}
              </button>
            </div>
          </div>
        </div>
        {/* Emoji picker modal component */}
        <EmojiModal
          showEmojiModal={showEmojiModal}
          setShowEmojiModal={setShowEmojiModal}
          setPostForm={setPostForm}
        />
      </form>
    </>
  );
};
