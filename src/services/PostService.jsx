import axios from "axios";

/**
 * Service that fetches all posts from the API
 * @returns {Promise} Promise with response containing all posts
 */
export const getAllPostService = async () => {
  return await axios.get("/api/posts");
};

/**
 * Service that likes a specific post
 * @param {string} postId - ID of the post to like
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const likePostService = async (postId, token) => {
  return await axios.post(
    `/api/posts/like/${postId}`,
    {},
    {
      headers: { authorization: token },
    }
  );
};

/**
 * Service that unlikes a specific post
 * @param {string} postId - ID of the post to unlike
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const dislikePostService = async (postId, token) => {
  return await axios.post(
    `/api/posts/dislike/${postId}`,
    {},
    {
      headers: { authorization: token },
    }
  );
};

/**
 * Service that creates a new post
 * @param {Object} post - Post data to create (content, image, etc.)
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const createPostService = async (post, token) => {
  return await axios.post(
    "/api/posts",
    {
      postData: post,
    },
    {
      headers: { authorization: token },
    }
  );
};

/**
 * Service that deletes a specific post
 * @param {string} postId - ID of the post to delete
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const deletePostService = async (postId, token) => {
  return await axios.delete(`/api/posts/${postId}`, {
    headers: { authorization: token },
  });
};

/**
 * Service that edits an existing post
 * @param {string} postId - ID of the post to edit
 * @param {Object} post - New post data
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const editPostService = async (postId, post, token) => {
  return await axios.post(
    `/api/posts/edit/${postId}`,
    {
      postData: post,
    },
    {
      headers: { authorization: token },
    }
  );
};

/**
 * Service that fetches comments of a specific post
 * @param {string} postId - ID of the post to fetch comments from
 * @returns {Promise} Promise with response containing post comments
 */
export const getCommentsService = async (postId) => {
  return await axios.get(`/api/comments/${postId}`);
};

/**
 * Service that adds a new comment to a post
 * @param {string} postId - ID of the post to add the comment to
 * @param {Object} commentData - Comment data (text, etc.)
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts with new comment
 */
export const addCommentsService = async (postId, commentData, token) => {

  return await axios.post(
    `/api/comments/add/${postId}`,
    {
      commentData: commentData,
    },
    {
      headers: { authorization: token },
    }
  );
};

/**
 * Service that deletes a comment from a post
 * @param {string} postId - ID of the post containing the comment
 * @param {string} commentId - ID of the comment to delete
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const deleteCommentService = async (postId, commentId, token) => {
  return await axios.post(
    `/api/comments/delete/${postId}/${commentId}`,
    {},
    { headers: { authorization: token } }
  );
};

/**
 * Service that edits an existing comment
 * @param {string} postId - ID of the post containing the comment
 * @param {string} commentId - ID of the comment to edit
 * @param {Object} commentData - New comment data
 * @param {string} token - User authentication token
 * @returns {Promise} Promise with response containing updated posts
 */
export const editCommentService = async (
  postId,
  commentId,
  commentData,
  token
) => {
  return await axios.post(
    `/api/comments/edit/${postId}/${commentId}`,
    { commentData },
    { headers: { authorization: token } }
  );
};
