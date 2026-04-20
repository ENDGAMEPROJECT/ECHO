import "./Post.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AttentionSeeker, Slide } from "react-awesome-reveal";
import { toast } from "react-hot-toast";
import { useTranslation } from 'react-i18next';
import { getLocalizedContent } from '../../utils/i18nHelpers.jsx';

import {
  RiHeart3Fill,
  RiHeart3Line,
  FaRegComment,
  RxDotsHorizontal,
  RxCross2,
} from "../../utils/icons.jsx";
import { useLoggedInUser } from "../../contexts/LoggedInUserProvider.jsx";
import { usePosts } from "../../contexts/PostsProvider.jsx";
import { EditPostForm } from "../EditPostForm/EditPostForm";
import { useUser } from "../../contexts/UserProvider.jsx";
import { Comment } from "./components/Comment/Comment";
import { getTimeDifference } from "../../utils/date.jsx";
import { assetPath } from "../../utils/assetPath";

/**
 * Post Component
 * 
 * Displays an individual post with user information, content, media, and interactions.
 * Features include likes, comments, edit/delete actions (admin only), and animation effects.
 * Supports both feed posts (static testimonials) and dynamic user-generated posts.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.post - Post data object containing:
 *   - _id, username, firstName, lastName, content, mediaUrl, type, likes, comments, createdAt, _isFeedPost
 * @param {boolean} [props.shouldFlash=false] - Whether to apply flash animation effect when component mounts
 * @returns {JSX.Element} Rendered post card with all interactive elements
 */
export const Post = ({ post, shouldFlash = false }) => {
  // Get i18n translation and current language for multilingual content support
  const { t, i18n } = useTranslation();
  
  // Router navigation hook for navigating to user profiles
  const navigate = useNavigate();
  
  // Local state to manage edit form visibility
  const [isEditPostClicked, setIsEditPostClicked] = useState(false);
  
  // Local state to manage action menu (edit/delete options) visibility
  const [actionMenu, setActionMenu] = useState(false);
  
  // Get post manipulation functions from global posts context
  const { likePost, dislikePost, deletePost } = usePosts();
  
  // Local state for comment input data (not actively used in current render, preserved for future enhancement)
  const [commentData, setCommentData] = useState({ text: "" });
  
  // Local state to toggle visibility of comments section
  const [showComments, setShowComments] = useState(false);
  
  // Get current logged-in user information
  const { loggedInUserState } = useLoggedInUser();
  
  // Get comment adding function from posts context (preserved for future enhancement)
  const { addComment } = usePosts();
  
  // Get all users for profile information lookup
  const { userState } = useUser();
  
  // Extract list of users who liked this post, safely handling missing data
  const likedBy = Array.isArray(post?.likes?.likedBy) ? post.likes.likedBy : [];
  
  // Check if current logged-in user has liked this post
  const isLikedByCurrentUser = likedBy.some(
    (user) => user?._id === loggedInUserState?._id
  );

  // Find complete user details from allUsers list for avatar and verification badge
  const userDetails = userState?.allUsers?.find(
    (user) => user?.username === post?.username
  );

  // Determine if current user has admin privileges - admin can edit/delete any post
  const isAdmin = loggedInUserState.isAdmin;

  /**
   * Handler function to copy post link to clipboard and show success toast.
   * Used for sharing functionality (preserved for future implementation).
   * 
   * @param {string} link - The post link/URL to copy to clipboard
   */
  const copyHandler = (link) => {
    navigator.clipboard.writeText(link);
    toast.success(t('post.linkCopied'));
  };

  return (
    // Container div with conditional flash animation class
    <div className={`post-card ${shouldFlash ? "post-card--flash" : ""}`}>
      {/* USER PROFILE SECTION */}
      <div className="profile-picture-container">
        {/* User avatar with special styling for ECHO Oficial account */}
        <img
          className={getLocalizedContent(post?.firstName, i18n.language) === "ECHO Oficial" ? "echo-logo-mini" : ""}
          src={assetPath(userDetails?.avatarURL || post?.avatarURL || post?._feedAvatarURL || "")}
          alt={userDetails?.firstName || getLocalizedContent(post?.firstName, i18n.language)}
        />{" "}
      </div>

      <div className="post-card-content">
        {/* POST HEADER: Username, date, and action menu */}
        <div className="name-container">
          <div className="username-container">
            {/* User name with verified badge if applicable */}
            <span className="name">
              {getLocalizedContent(post?.firstName, i18n.language)} {post?.lastName}
              {userDetails?.verified === true && (
                <img
                  src={assetPath("/assets/verified_badge.png")}
                  alt={t('post.verifiedAccount')}
                  className="verified-badge"
                  title={t('post.verifiedAccount')}
                />
              )}
            </span>{" "}
            
            {/* User username with @ symbol */}
            <span className="username">
              {`@${post?.username}`}
            </span>
            {"  "}
            
            {/* Relative time since post creation (e.g., "2 hours ago") */}
            <span className="date">
              {getTimeDifference(post?.createdAt, i18n.language)}
            </span>
            
            {/* Admin action menu button - only visible to admin users */}
            {isAdmin && (
              <div
                className="edit"
                onClick={(e) => {
                  e.stopPropagation();
                  setActionMenu(!actionMenu);
                }}
              >
                <RxDotsHorizontal className="three-dots-icon" />
              </div>
            )}
            
            {/* Dropdown action menu for edit/delete options */}
            {actionMenu && (
              <div className="action-menu-container">
                <AttentionSeeker effect="headShake">
                  {/* Edit option - only available to post owner and admin */}
                  {loggedInUserState.username === post?.username && (
                    <p
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditPostClicked(!isEditPostClicked);
                        setActionMenu(false);
                      }}
                    >
                      {t('post.editPost')}
                    </p>
                  )}
                  {/* Delete option - available to post owner and admin */}
                  <p
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePost(post?._id, "admin-token");
                      setActionMenu(false);
                    }}
                  >
                    {t('post.deletePost')}
                  </p>
                </AttentionSeeker>
              </div>
            )}
          </div>
        </div>
        
        {/* EDIT POST MODAL - shown when edit button is clicked */}
        {isEditPostClicked && (
          <div className="create-post-modal">
            <EditPostForm
              className="modal-content"
              setIsEditPostClicked={setIsEditPostClicked}
              post={post}
              setActionMenu={setActionMenu}
            />
          </div>
        )}

        {/* POST CONTENT - main text body of the post */}
        <div className="caption-container">
          <p>{getLocalizedContent(post?.content, i18n.language)}</p>
        </div>

        {/* POST MEDIA - video or image if attached to post */}
        <div className="media">
          {/* Video with controls and autoplay/mute for better UX */}
          {post?.mediaUrl && post.type !== "image" && (
            <video controls autoPlay muted loop>
              <source src={assetPath(post?.mediaUrl)} />
            </video>
          )}
          {/* Image display */}
          {post?.mediaUrl && post?.type === "image" && (
            <img src={assetPath(post?.mediaUrl)} alt="" />
          )}
        </div>

        {/* POST ACTIONS: Comments and Likes */}
        <div className="post-actions-container">
          <Slide
            fraction="0"
            duration="350"
            direction="up"
            cascade
            damping={0.3}
          >
            {/* COMMENTS BUTTON - clicks to show/hide comments section */}
            <div
              onClick={() => setShowComments(!showComments)}
              className="comments-container"
            >
              {/* Comment icon */}
              <FaRegComment className="comment-icon" />
              {/* Comment count with animation */}
              <span className="number-of-comments">
                <Slide direction="up">{post?.comments?.length}</Slide>
              </span>
            </div>
            
            {/* LIKE BUTTON - toggles heart icon and like count */}
            <div className="comments-container">
              {/* Filled heart if user already liked, empty heart if not */}
              {isLikedByCurrentUser ? (
                <RiHeart3Fill
                  className="like-icon like-done-icon"
                  onClick={() => !post?._isFeedPost && dislikePost(post?._id, "admin-token")}
                  style={{ cursor: post?._isFeedPost ? "default" : "pointer" }}
                />
              ) : (
                <RiHeart3Line
                  className="like-icon"
                  onClick={() => !post?._isFeedPost && likePost(post?._id, "admin-token")}
                  style={{ cursor: post?._isFeedPost ? "default" : "pointer" }}
                />
              )}
              
              {/* Like count with formatting (e.g., 1.2M, 3.5k, 125) */}
              <span>{(() => {
                const raw = post?.likes?.likeCount ?? 0;
                let num;
                // Handle both numeric and string formats
                if (typeof raw === "number") {
                  num = raw;
                } else {
                  const s = String(raw).trim().toLowerCase();
                  // Parse formatted strings like "4.8k" or "1.2M"
                  if (s.endsWith("m")) num = parseFloat(s) * 1_000_000;
                  else if (s.endsWith("k")) num = parseFloat(s) * 1_000;
                  else num = parseFloat(s) || 0;
                }
                // Format large numbers for display
                if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "M";
                if (num >= 1_000) return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "k";
                return String(num);
              })()}</span>
            </div>
          </Slide>
        </div>

        {/* COMMENTS SECTION - shows all comments when expanded */}
        {showComments && (
          <div className="comments-section-container">
            <div className="all-comments-container">
              {/* Display comments sorted by newest first */}
              {post?.comments
                ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                ?.map((comment) => (
                  <Comment key={comment?._id} comment={comment} post={post} />
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
