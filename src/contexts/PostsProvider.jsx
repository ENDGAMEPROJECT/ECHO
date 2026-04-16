import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { reinitializeServer } from "../server.jsx";

/**
 * Import all post and comment API service functions
 * 
 * These services handle all backend API communication for:
 * - Post CRUD operations (create, read, update, delete)
 * - Like/dislike functionality
 * - Comment management (add, edit, delete, retrieve)
 */
import {
  getAllPostService,
  likePostService,
  dislikePostService,
  createPostService,
  deletePostService,
  editPostService,
  getCommentsService,
  addCommentsService,
  deleteCommentService,
  editCommentService,
} from "../services/PostService.jsx";

/**
 * PostsContext
 * 
 * React Context for managing all posts and post-related operations across the application.
 * Provides:
 * - All posts data from the database
 * - Functions to create, edit, delete posts
 * - Like/dislike functionality
 * - Comment management (add, edit, delete)
 * - Loading state for async operations
 * - Sorting preferences
 * 
 * Integrates with:
 * - PostService: API communication
 * - i18n: Language change detection (reinitializes posts on language switch)
 * - Server: Mock/development server for data persistence
 */
const PostsContext = createContext();

/**
 * PostsProvider Component
 * 
 * Context provider that manages the global state of all posts and post-related operations.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to posts context
 * @returns {JSX.Element} Context provider wrapping children
 */
export const PostsProvider = ({ children }) => {
  // Get i18n for language change detection
  const { i18n } = useTranslation();
  
  // State: all posts retrieved from the API
  // Array of post objects, each containing: id, content, author, likes, comments, timestamp, etc.
  const [allPosts, setAllPosts] = useState([]);
  
  // State: loading indicator for async operations
  // Set to true during API calls, false when complete
  // Prevents UI from showing stale data during loading
  const [postLoading, setPostLoading] = useState(false);
  
  // State: current sorting preference for posts display
  // Values: "Latest" (newest first), "Oldest" (oldest first), "Trending" (most liked)
  // Used in UI to sort posts before rendering
  const [sortBy, setSortBy] = useState("Latest");

  /**
   * Fetch all posts from the API
   * 
   * Called on component mount and when language changes.
   * Sets loading state during the request to prevent stale UI.
   * 
   * API Response Expected:
   * {
   *   status: 200,
   *   data: {
   *     posts: [ { id, content, author, likes, comments, ... }, ... ]
   *   }
   * }
   * 
   * @returns {Promise<void>}
   */
  const getAllPosts = async () => {
    try {
      // Set loading state to prevent stale UI
      setPostLoading(true);
      // Call API to fetch all posts
      const response = await getAllPostService();
      // On success, update posts state
      if (response.status === 200) {
        setPostLoading(false);
        setAllPosts(response.data.posts);
      }
    } catch (error) {
      setPostLoading(false);
      console.error(error);
    } finally {
      // Ensure loading state is cleared even if error occurs
      setPostLoading(false);
    }
  };

  /**
   * Like a specific post
   * 
   * Adds the authenticated user to the post's likedBy array.
   * Updates the entire posts list to reflect the change.
   * 
   * @param {string} postId - ID of the post to like
   * @param {string} token - Authentication token of the user liking the post
   * @returns {Promise<void>}
   */
  const likePost = async (postId, token) => {
    try {
      // Call API to like the post
      const response = await likePostService(postId, token);
      // On success, update posts state with the new posts array
      if (response.status === 201) {
        setPostLoading(false);
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Unlike a specific post (remove like)
   * 
   * Removes the authenticated user from the post's likedBy array.
   * Updates the entire posts list to reflect the change.
   * 
   * @param {string} postId - ID of the post to unlike
   * @param {string} token - Authentication token of the user removing the like
   * @returns {Promise<void>}
   */
  const dislikePost = async (postId, token) => {
    try {
      // Call API to remove like from the post
      const response = await dislikePostService(postId, token);
      // On success, update posts state with the new posts array
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Delete a specific post
   * 
   * Only the post author or admin can delete a post.
   * Removes the post from the database and updates the local posts list.
   * 
   * @param {string} postId - ID of the post to delete
   * @param {string} token - Authentication token of the user (must be post author or admin)
   * @returns {Promise<void>}
   */
  const deletePost = async (postId, token) => {
    try {
      // Call API to delete the post
      const response = await deletePostService(postId, token);
      // On success, update posts state (post should be removed from array)
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Create a new post
   * 
   * Submits a new post to the API and adds it to the posts list.
   * Post data includes content, media (images/videos), mentions, hashtags.
   * 
   * Post Object Expected:
   * {
   *   content: "Post text",
   *   media: [ { type: "image", url: "..." } ],
   *   mentions: [ "@user1", "@user2" ],
   *   hashtags: [ "#topic1" ]
   * }
   * 
   * @param {Event} e - Form submit event (preventDefault called to prevent page reload)
   * @param {Object} post - Post data to create
   * @param {string} token - Authentication token of the user creating the post
   * @returns {Promise<void>}
   */
  const createPost = async (e, post, token) => {
    try {
      // Prevent form default submission behavior (page reload)
      e.preventDefault();
      // Call API to create the post
      const response = await createPostService(post, token);
      // On success, update posts state to include the new post
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Edit an existing post
   * 
   * Only the post author or admin can edit a post.
   * Updates the post content and media in the database.
   * 
   * @param {Event} e - Form submit event (preventDefault called)
   * @param {string} postId - ID of the post to edit
   * @param {Object} post - Updated post data (content, media, mentions, hashtags)
   * @param {string} token - Authentication token (must be post author or admin)
   * @returns {Promise<void>}
   */
  const editPost = async (e, postId, post, token) => {
    try {
      // Prevent form default submission behavior
      e.preventDefault();
      // Call API to edit the post
      const response = await editPostService(postId, post, token);
      // On success, update posts state with the edited post
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Fetch comments for a specific post
   * 
   * Retrieves all comments on a post from the API.
   * Note: Currently only logs the response (appears to be incomplete implementation).
   * 
   * @param {string} postId - ID of the post to fetch comments for
   * @returns {Promise<void>}
   */
  const getComments = async (postId) => {
    try {
      // Call API to fetch comments for the post
      const response = getCommentsService(postId);
      // On success, log the response (TODO: implement state update)
      if (response.status === 200) {
        console.log(response);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Add a new comment to a post
   * 
   * Creates a new comment on the specified post.
   * Updates the posts list to include the new comment.
   * 
   * Comment Data Expected:
   * {
   *   content: "Comment text",
   *   mentions: [ "@user1" ],
   *   media: [ { type: "image", url: "..." } ]
   * }
   * 
   * @param {string} postId - ID of the post to add comment to
   * @param {Object} commentData - Comment content and metadata
   * @param {string} token - Authentication token of the commenter
   * @returns {Promise<void>}
   */
  const addComment = async (postId, commentData, token) => {
    try {
      // Call API to add the comment to the post
      const response = await addCommentsService(postId, commentData, token);
      // On success, update posts state (post should now include the new comment)
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Delete a comment from a post
   * 
   * Only the comment author or admin can delete a comment.
   * Removes the comment from the post and updates the posts list.
   * 
   * @param {string} postId - ID of the post containing the comment
   * @param {string} commentId - ID of the comment to delete
   * @param {string} token - Authentication token (must be comment author or admin)
   * @returns {Promise<void>}
   */
  const deleteComment = async (postId, commentId, token) => {
    try {
      // Call API to delete the comment
      const response = await deleteCommentService(postId, commentId, token);
      // On success, update posts state (comment should be removed from post)
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Edit an existing comment
   * 
   * Only the comment author or admin can edit a comment.
   * Updates the comment content in the post.
   * 
   * @param {string} postId - ID of the post containing the comment
   * @param {string} commentId - ID of the comment to edit
   * @param {Object} commentData - Updated comment data (content, mentions, media)
   * @param {string} token - Authentication token (must be comment author or admin)
   * @returns {Promise<void>}
   */
  const editComment = async (postId, commentId, commentData, token) => {
    try {
      // Call API to edit the comment
      const response = await editCommentService(
        postId,
        commentId,
        commentData,
        token
      );
      // On success, update posts state with the edited comment
      if (response.status === 201) {
        setAllPosts([...response.data.posts]);
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  /**
   * Effect: Load all posts on component mount
   * 
   * Triggers only once when the provider mounts.
   * Fetches initial posts data from the API to populate the app.
   */
  useEffect(() => {
    getAllPosts();
  }, []);

  /**
   * Effect: Listen for language changes and reload posts with new language
   * 
   * Triggers when the user changes the app language.
   * Process:
   * 1. Detects language change event from i18n
   * 2. Reinitializes the mock server with the new language
   * 3. Waits 100ms for server to reinitialize
   * 4. Reloads all posts to get localized content
   * 
   * This ensures posts content is properly localized when switching languages.
   * For example, post content, comments, and timestamps are refreshed.
   */
  useEffect(() => {
    const handleLanguageChange = async (lng) => {
      try {
        // Log language change detection
        console.log('🔄 Language change detected in PostsProvider:', lng);
        // Reinitialize server with the new language
        reinitializeServer(lng);
        // Wait for server to complete reinitialization (100ms buffer)
        await new Promise(resolve => setTimeout(resolve, 100));
        // Reload all posts to get localized content
        await getAllPosts();
      } catch (error) {
        console.error("Error changing language:", error);
      }
    };

    // Subscribe to language change events from i18n
    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup: unsubscribe from language change events on unmount
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);
  
  // Provide the posts context with all state and functions to child components
  return (
    <PostsContext.Provider
      value={{
        // Sorting
        setSortBy,                    // Function to change sort order (Latest, Oldest, Trending)
        sortBy,                       // Current sort preference
        // Posts data and operations
        allPosts,                     // Array of all posts
        likePost,                     // Function to like a post
        dislikePost,                  // Function to unlike a post
        createPost,                   // Function to create a new post
        deletePost,                   // Function to delete a post
        editPost,                     // Function to edit a post
        // Comment operations
        addComment,                   // Function to add a comment to a post
        editComment,                  // Function to edit a comment
        deleteComment,                // Function to delete a comment
        getComments,                  // Function to fetch comments for a post
        // Loading state
        postLoading,                  // Boolean indicating if posts are being loaded
      }}
    >
      {children}
    </PostsContext.Provider>
  );
};

/**
 * usePosts Hook
 * 
 * Custom hook to access the posts context from any component.
 * 
 * Returns context object containing:
 * - setSortBy(value): Set sort order
 * - sortBy: Current sort preference
 * - allPosts: Array of all posts
 * - likePost(postId, token): Like a post
 * - dislikePost(postId, token): Unlike a post
 * - createPost(e, post, token): Create a new post
 * - deletePost(postId, token): Delete a post
 * - editPost(e, postId, post, token): Edit a post
 * - addComment(postId, commentData, token): Add comment to post
 * - editComment(postId, commentId, commentData, token): Edit a comment
 * - deleteComment(postId, commentId, token): Delete a comment
 * - getComments(postId): Fetch comments for a post
 * - postLoading: Boolean loading state
 * 
 * Usage:
 *   const { allPosts, likePost, createPost } = usePosts();
 * 
 * Throws error if used in a component not wrapped by PostsProvider.
 * 
 * @returns {Object} Posts context containing all state and functions
 * @throws {Error} If context not found (component not within PostsProvider)
 */
export const usePosts = () => useContext(PostsContext);
