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

export const Post = ({ post, shouldFlash = false }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isEditPostClicked, setIsEditPostClicked] = useState(false);
  const [actionMenu, setActionMenu] = useState(false);
  const { likePost, dislikePost, deletePost } = usePosts();
  const [commentData, setCommentData] = useState({ text: "" });
  const [showComments, setShowComments] = useState(false);
  const { loggedInUserState } = useLoggedInUser();
  const { addComment } = usePosts();
  const { userState } = useUser();
  const likedBy = Array.isArray(post?.likes?.likedBy) ? post.likes.likedBy : [];
  const isLikedByCurrentUser = likedBy.some(
    (user) => user?._id === loggedInUserState?._id
  );

  const userDetails = userState?.allUsers?.find(
    (user) => user?.username === post?.username
  );

  // El admin es el único usuario, puede hacer todo
  const isAdmin = loggedInUserState.isAdmin;

  const copyHandler = (link) => {
    navigator.clipboard.writeText(link);
    toast.success(t('post.linkCopied'));
  };

  return (
    <div className={`post-card ${shouldFlash ? "post-card--flash" : ""}`}>
      <div className="profile-picture-container">
        <img
          className={getLocalizedContent(post?.firstName, i18n.language) === "ECHO Oficial" ? "echo-logo-mini" : ""}
          src={assetPath(userDetails?.avatarURL || post?.avatarURL || post?._feedAvatarURL || "")}
          alt={userDetails?.firstName || getLocalizedContent(post?.firstName, i18n.language)}
        />{" "}
      </div>

      <div className="post-card-content">
        <div className="name-container">
          <div
            className="username-container"
          >
            <span
              className="name"
            >
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
            <span
              className="username"
            >
              {" "}
              {`@${post?.username}`}
            </span>
            {"  "}
            <span
              className="date"
            >
              {getTimeDifference(post?.createdAt, i18n.language)}
            </span>
            {/* El admin siempre puede editar/borrar cualquier post */}
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
            {actionMenu && (
              <div className="action-menu-container">
                <AttentionSeeker effect="headShake">
                  {/* Solo mostrar Edit si es el dueño del post */}
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
                  {/* Admin siempre puede borrar */}
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

        <div className="caption-container">
          <p>{getLocalizedContent(post?.content, i18n.language)}</p>
        </div>

        <div className="media">
          {post?.mediaUrl && post.type !== "image" && (
            <video controls autoPlay muted loop>
              <source src={assetPath(post?.mediaUrl)} />
            </video>
          )}
          {post?.mediaUrl && post?.type === "image" && (
            <img src={assetPath(post?.mediaUrl)} alt="" />
          )}
        </div>

        <div className="post-actions-container">
          <Slide
            fraction="0"
            duration="350"
            direction="up"
            cascade
            damping={0.3}
          >
            <div
              onClick={() => setShowComments(!showComments)}
              className="comments-container"
            >
              {/* <Slide cascade direction="up"> */}
              <FaRegComment className="comment-icon" />
              {/* </Slide> */}
              <span className="number-of-comments">
                <Slide direction="up">{post?.comments?.length}</Slide>
              </span>
            </div>
            <div className="comments-container">
              {isLikedByCurrentUser ? (
                <RiHeart3Fill
                  className="like-icon like-done-icon"
                  onClick={() => dislikePost(post?._id, "admin-token")}
                />
              ) : (
                <RiHeart3Line
                  className="like-icon"
                  onClick={() => likePost(post?._id, "admin-token")}
                />
              )}
              <span>{(() => {
                const raw = post?.likes?.likeCount ?? 0;
                let num;
                if (typeof raw === "number") {
                  num = raw;
                } else {
                  const s = String(raw).trim().toLowerCase();
                  if (s.endsWith("m")) num = parseFloat(s) * 1_000_000;
                  else if (s.endsWith("k")) num = parseFloat(s) * 1_000;
                  else num = parseFloat(s) || 0;
                }
                if (num >= 1_000_000) return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "M";
                if (num >= 1_000) return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1).replace(/\.0$/, "") + "k";
                return String(num);
              })()}</span>
            </div>
          </Slide>
        </div>

        {showComments && (
          <div className="comments-section-container">
            <div className="all-comments-container">
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
