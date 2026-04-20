/**
 * UserService: API service endpoints for user management
 * 
 * Purpose: Provides axios-based HTTP client functions for all user-related operations
 * Features: User retrieval, profile editing, follow/unfollow functionality
 * Usage: Import functions and call with required parameters and auth tokens
 */

import axios from "axios";

/**
 * Service that fetches all users from the API
 * 
 * @returns {Promise} Promise with response containing all users and their data
 */
export const getAllUserService = async () => {
  return await axios.get("/api/users");
};

/**
 * Service that fetches a specific user by ID
 * 
 * @param {string} id - User ID to fetch
 * @returns {Promise} Promise with response containing requested user data
 */
export const getUserService = async (id) => {
  return await axios.get(`/api/users/${id}`);
};

/**
 * Service that updates user profile information
 * 
 * @param {Object} userData - User data to update (name, bio, avatar, etc.)
 * @param {string} token - User authentication token for authorization
 * @returns {Promise} Promise with response containing updated user profile
 */
export const editUserService = async (userData, token) => {
  return await axios.post(
    "/api/users/edit",
    { userData },
    { headers: { authorization: token } }
  );
};

/**
 * Service that adds a follow relationship between users
 * 
 * Purpose: Allows current user to follow another user (add to following list)
 * @param {string} userId - ID of the user to follow
 * @param {string} token - Current user authentication token for authorization
 * @returns {Promise} Promise with response containing updated follower/following relationships
 */
export const followUserService = async (userId, token) => {
  return await axios.post(
    `/api/users/follow/${userId}`,
    {},
    {
      headers: { authorization: token },
    }
  );
};

/**
 * Service that removes a follow relationship between users
 * 
 * Purpose: Allows current user to unfollow another user (remove from following list)
 * @param {string} userId - ID of the user to unfollow
 * @param {string} token - Current user authentication token for authorization
 * @returns {Promise} Promise with response containing updated follower/following relationships
 */
export const unfollowUserService = async (userId, token) => {
  return await axios.post(
    `/api/users/unfollow/${userId}`,
    {},
    {
      headers: { authorization: token },
    }
  );
};


