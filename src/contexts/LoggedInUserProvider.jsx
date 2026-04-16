import React, { createContext, useContext } from "react";
import { useReducer, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { loggedInUserReducer, initial } from "../reducers/loggedInUserReducer.jsx";
import {
  editUserService,
  followUserService,
  unfollowUserService,
  getUserService,
} from "../services/UserService.jsx";
import { useUser } from "./UserProvider.jsx";

/**
 * LoggedInUserContext
 * 
 * React Context for managing the currently logged-in user's profile and state.
 * Provides the authenticated user's data, follow/unfollow functions, and profile editing.
 */
const LoggedInUserContext = createContext();

/**
 * LoggedInUserProvider Component
 * 
 * Context provider that manages the state and actions for the currently logged-in user.
 * 
 * Features:
 * - Stores the logged-in user's profile information
 * - Initializes with ECHO official admin account
 * - Provides functions for:
 *   - Fetching user data from API
 *   - Editing user profile information
 *   - Following other users
 *   - Unfollowing users
 * - Syncs changes with the global UserProvider (allUsers list)
 * - Provides preset avatar URLs for profile customization
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to logged-in user context
 * @returns {JSX.Element} Context provider wrapping children
 */
export const LoggedInUserProvider = ({ children }) => {
  // Get global user state and dispatch from UserProvider
  // userState contains allUsers list, dispatch updates it
  const { userState, dispatch } = useUser();
  
  // Get translation function for multilingual support
  const { t } = useTranslation();

  /**
   * Logged-in user state management using useReducer
   * 
   * State: loggedInUserState - current logged-in user object
   * Dispatch: loggedInUserDispatch - function to update logged-in user
   * 
   * Uses loggedInUserReducer from reducers/loggedInUserReducer.jsx
   * Initial state: 'initial' (likely an empty or default user object)
   */
  const [loggedInUserState, loggedInUserDispatch] = useReducer(
    loggedInUserReducer,
    initial
  );

  /**
   * Fetch user data from API and update local state
   * 
   * Called when:
   * - User logs in
   * - Profile page loads for current user
   * - Need to refresh user data
   * 
   * @param {Object} user - User object with identifier (username or _id)
   * @returns {Promise<void>}
   */
  const getUser = async (user) => {
    try {
      // Call API to fetch user details
      const response = await getUserService(user);
      if (response.status === 200) {
        // Update local logged-in user state with fetched data
        loggedInUserDispatch({
          type: "SET_USER",
          payload: { ...response.data.user },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Edit the logged-in user's profile information
   * 
   * Updates user data both locally and in the global users list.
   * After successful update:
   * - Updates loggedInUserState
   * - Updates the user in allUsers list (maintains consistency)
   * 
   * @param {Object} userData - User data to update (e.g., { bio, firstName, lastName, avatarURL })
   * @returns {Promise<void>}
   */
  const editUser = async (userData) => {
    try {
      // Call API to edit user profile with admin token
      const response = await editUserService(userData, "admin-token");
      if (response.status === 201) {
        // Get updated user from response
        const updatedUser = response.data.user;
        
        // Update local logged-in user state
        loggedInUserDispatch({ type: "SET_USER", payload: updatedUser });
        
        // Update the user in the global allUsers list to maintain consistency
        // Map through all users and replace the edited user
        const updatedUsers = userState.allUsers.map((user) =>
          user.username === updatedUser.username ? updatedUser : user
        );
        
        // Dispatch to global UserProvider to update allUsers
        dispatch({ type: "SET_ALL_USERS", payload: [...updatedUsers] });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Follow another user
   * 
   * Adds the target user to the logged-in user's following list.
   * Triggers a mutual update:
   * - Current user's followingCount increases
   * - Target user's followersCount increases
   * - Both users updated in allUsers list
   * 
   * @param {string} userId - The ID of the user to follow
   * @returns {Promise<void>}
   */
  const followUser = async (userId) => {
    try {
      // Call API to follow user with admin token
      const response = await followUserService(userId, "admin-token");
      if (response.status === 200) {
        // Get updated current user and the followed user from response
        const { user, followUser } = response.data;
        
        // Update the global allUsers list with both updated users
        // Current user (updated following list) and followed user (updated follower count)
        const updatedAllUser = userState?.allUsers.map((individualUser) =>
          individualUser.username === user.username
            ? { ...user }
            : individualUser.username === followUser.username
            ? { ...followUser }
            : individualUser
        );

        // Update global user state
        dispatch({ type: "SET_ALL_USERS", payload: [...updatedAllUser] });
        
        // Update local logged-in user state with updated follow list
        loggedInUserDispatch({ type: "SET_USER", payload: user });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Unfollow another user
   * 
   * Removes the target user from the logged-in user's following list.
   * Triggers a mutual update:
   * - Current user's followingCount decreases
   * - Target user's followersCount decreases
   * - Both users updated in allUsers list
   * 
   * @param {string} userId - The ID of the user to unfollow
   * @returns {Promise<void>}
   */
  const unfollowUser = async (userId) => {
    try {
      // Call API to unfollow user with admin token
      const response = await unfollowUserService(userId, "admin-token");
      if (response.status === 200) {
        // Get updated current user and the unfollowed user from response
        const { user, followUser } = response.data;

        // Update the global allUsers list with both updated users
        // Current user (updated following list) and unfollowed user (updated follower count)
        const updatedAllUser = userState?.allUsers.map((individualUser) =>
          individualUser.username === user.username
            ? { ...user }
            : individualUser.username === followUser.username
            ? { ...followUser }
            : individualUser
        );

        // Update global user state
        dispatch({ type: "SET_ALL_USERS", payload: [...updatedAllUser] });
        
        // Update local logged-in user state with updated follow list
        loggedInUserDispatch({ type: "SET_USER", payload: user });
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Avatar URL presets
   * 
   * Predefined list of avatar URLs that users can choose from
   * when customizing their profile.
   * Images hosted on Cloudinary CDN.
   */
  const avatars = [
    {
      url: "https://res.cloudinary.com/darwtgzlk/image/upload/v1687601406/socialMedia/avatar/avatar-1_yg7arg.png",
    },
    {
      url: "https://res.cloudinary.com/darwtgzlk/image/upload/v1687601402/socialMedia/avatar/avatar2_wxqedh.png",
    },
    {
      url: "https://res.cloudinary.com/darwtgzlk/image/upload/v1687601397/socialMedia/avatar/avatar3_gc9xeu.png",
    },
  ];

  /**
   * Effect: Initialize with ECHO official admin account on mount
   * 
   * Sets up the logged-in user as the ECHO official admin account.
   * This account is used to:
   * - Manage the social media platform
   * - Post official announcements/content
   * - Moderate user-generated content
   * - Appear as the system admin
   * 
   * The profile information is localized using i18n translations.
   * Dependencies: [t] - re-runs if translation language changes
   */
  useEffect(() => {
    // Create ECHO official admin user object
    const echoAdmin = {
      _id: "echo-official",
      username: "ECHO",
      firstName: t("officialAccount.name"),        // Localized name from translations
      handle: t("officialAccount.handle"),          // Localized handle
      bio: t("officialAccount.bio"),                // Localized bio description
      avatarURL: "/assets/echo-logo-bg.png",       // Custom ECHO logo as avatar
      verified: true,                              // Verified badge (checkmark)
      isAdmin: true,                               // Admin privileges flag
      stats: { followersCount: 0, followingCount: 0 }, // Initial follower/following counts
    };
    
    // Set ECHO admin as the logged-in user
    loggedInUserDispatch({ type: "SET_USER", payload: echoAdmin });
  }, [t]); // Re-run if translation language changes

  return (
    // Provide logged-in user context and functions to all child components
    <LoggedInUserContext.Provider
      value={{
        loggedInUserState,          // Current logged-in user data
        loggedInUserDispatch,       // Dispatch function for custom updates
        editUser,                   // Function to edit user profile
        followUser,                 // Function to follow a user
        unfollowUser,               // Function to unfollow a user
        avatars,                    // List of available avatar URLs
      }}
    >
      {children}
    </LoggedInUserContext.Provider>
  );
};

/**
 * useLoggedInUser Hook
 * 
 * Custom hook to access the logged-in user context from any component.
 * 
 * Returns the entire context object containing:
 * - loggedInUserState: Current logged-in user data
 * - loggedInUserDispatch: Direct state dispatch (advanced usage)
 * - editUser(userData): Function to update user profile
 * - followUser(userId): Function to follow another user
 * - unfollowUser(userId): Function to unfollow a user
 * - avatars: Array of available avatar URLs
 * 
 * Usage:
 *   const { loggedInUserState, editUser, followUser } = useLoggedInUser();
 *   console.log(loggedInUserState.username);
 * 
 * Throws error if used in a component not wrapped by LoggedInUserProvider.
 * 
 * @returns {Object} LoggedInUserContext containing all logged-in user state and functions
 * @throws {Error} If context not found (component not within LoggedInUserProvider)
 */
export const useLoggedInUser = () => useContext(LoggedInUserContext);
