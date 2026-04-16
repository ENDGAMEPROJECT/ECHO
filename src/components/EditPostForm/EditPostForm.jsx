import "./EditPostForm.css";
import React, { useState, useEffect } from "react";
import { IoMdClose, ImFilePicture, BsEmojiSmile } from "../../utils/icons.jsx";
import "../CreatePostForm/CreatePostForm.css";
import { useLoggedInUser } from "../../contexts/LoggedInUserProvider.jsx";
import { usePosts } from "../../contexts/PostsProvider.jsx";
import { EmojiModal } from "../EmojiModal/EmojiModal";
import { toast } from "react-hot-toast";
import { assetPath } from "../../utils/assetPath";

/**
 * EditPostForm Component
 * 
 * Renders a form for editing existing posts with the following features:
 * - Text content editing with textarea
 * - Media replacement (images and videos) with validation
 * - Emoji picker support
 * - Maintains original post data with option to update
 * - User avatar display
 * 
 * @param {function} setIsEditPostClicked - Callback to close the edit form modal
 * @param {string} className - Optional CSS class name for styling
 * @param {Object} post - The post object being edited (contains content, mediaUrl, type)
 * @param {function} setActionMenu - Callback to close the action menu
 * 
 * @returns {JSX.Element} The post editing form component
 */
export const EditPostForm = ({
  setIsEditPostClicked,
  className,
  post,
  setActionMenu,
}) => {
  // Get editPost function from posts context
  const { editPost } = usePosts();
  // Get logged-in user data from context
  const { loggedInUserState } = useLoggedInUser();
  // State for controlling emoji picker modal visibility
  const [showEmojiModal, setShowEmojiModal] = useState(false);

  /**
   * Post edit form state object containing:
   * - content: Text content of the post being edited
   * - mediaUrl: URL to the media (image or video)
   * - type: Type of media ('image' or 'video')
   */
  const [postEditForm, setPostEditForm] = useState({
    content: post?.content,
    mediaUrl: post?.mediaUrl,
    type: "video",
  });

  /**
   * Handles media file input and validation for post editing
   * 
   * Validates:
   * - File type (only images and videos allowed)
   * - File size (maximum 20MB)
   * 
   * Creates object URL for preview and determines media type
   * 
   * @param {Event} e - Change event from file input
   */
  const handleEditMediaInput = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    // Check if file is an image or video
    if (file?.type?.startsWith("image/") || file?.type?.startsWith("video/")) {
      // Validate file size does not exceed 20MB
      if (file.size < 20 * 1024 * 1024) {
        // Update form with media preview and type
        setPostEditForm((prev) => ({
          ...prev,
          mediaUrl: URL.createObjectURL((file)),
          type: file?.type?.startsWith("image/") ? "image" : "video",
        }));
      } else {
        // Show error toast if file is too large
        toast.error("file must be less than 20mb");
      }
    } else {
      // Show error toast if file type is not supported
      toast.error("file must be a Video (MP4/MOV) or an Image (JPEG/PNG)");
    }
  };

  /**
   * Synchronize the post form with the post data when logged-in user context changes
   * Updates content, mediaUrl, and type with current post information
   */
  useEffect(() => {
    setPostEditForm((prev) => ({
      ...prev,
      content: post?.content,
      mediaUrl: post?.mediaUrl,
      type: post?.type || "video",
    }));
  }, [loggedInUserState]);

  return (
    <>
      {/* Main form container for editing an existing post */}
      <form
        onSubmit={(e) => {
          // Submit the edited post with its ID and updated form data
          editPost(e, post._id, postEditForm, "admin-token");
          // Reset form to initial state after submission
          setPostEditForm({
            content: "",
            mediaUrl: "",
          });
          // Close the edit form modal
          setIsEditPostClicked(false);
          // Close the action menu
          setActionMenu(false);
        }}
        className={`new-post-container ${className}`}
      >
        {/* User avatar section */}
        <div className="img-container">
          <img
            className="echo-logo-create-post"
            src={assetPath(loggedInUserState?.avatarURL)}
            alt={loggedInUserState?.firstName}
          />
        </div>
        {/* Main input area containing text and media elements */}
        <div className="input-container">
          {/* Text content input section */}
          <div className="text-content-container">
            {/* Textarea for post content editing */}
            <textarea
              onChange={(e) =>
                setPostEditForm((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
              value={postEditForm.content}
              placeholder="What is happening?!"
            />
            {/* Close button to dismiss the edit form modal */}
            {setIsEditPostClicked && (
              <IoMdClose
                onClick={() => {
                  setIsEditPostClicked && setIsEditPostClicked(false);
                }}
                className="close-create-post-modal"
              />
            )}
          </div>
          {/* Media preview section for videos */}
          {postEditForm?.mediaUrl && postEditForm?.type !== "image" && (
            <div className="media-container">
              <video muted loop>
                <source src={assetPath(postEditForm?.mediaUrl)} />
              </video>
              {/* Close button to remove video from post */}
              <IoMdClose
                onClick={() => {
                  setPostEditForm({ ...postEditForm, mediaUrl: "" });
                }}
                className="close-media"
              />
            </div>
          )}
          {/* Media preview section for images */}
          {postEditForm?.mediaUrl && postEditForm.type === "image" && (
            <div className="media-container">
              <img src={assetPath(postEditForm?.mediaUrl)} alt="" />
              {/* Close button to remove image from post */}
              <IoMdClose
                onClick={() => {
                  setPostEditForm({ ...postEditForm, mediaUrl: "" });
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
              <label htmlFor="media">
                {" "}
                <ImFilePicture className="file-icon" />
              </label>
              <input onChange={handleEditMediaInput} type="file" id="media" />

              {/* Emoji picker button */}
              <BsEmojiSmile
                className="smily-emoji "
                onClick={() => setShowEmojiModal(true)}
              />
            </div>
            {/* Submit button container */}
            <div className="post-btn-container">
              {/* Update button - disabled if no content or media present */}
              <input
                disabled={!postEditForm.content && !postEditForm.mediaUrl}
                type="submit"
                value="Update"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Emoji picker modal component */}
      <EmojiModal
        showEmojiModal={showEmojiModal}
        setShowEmojiModal={setShowEmojiModal}
        setPostForm={setPostEditForm}
      />
    </>
  );
};
