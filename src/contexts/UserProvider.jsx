import React, { createContext, useContext, useEffect } from "react";
import { useReducer } from "react";
import { useTranslation } from "react-i18next";

import { getAllUserService } from "../services/UserService.jsx";
import { userReducer } from "../reducers/userReducer.jsx";
import { initial } from "../reducers/userReducer.jsx";

/**
 * UserContext - Manages all users in the application
 * Provides user state and dispatch to consuming components
 */
const UserContext = createContext();

/**
 * UserProvider - Manages user list state and language-aware data fetching
 * 
 * Responsibilities:
 * - Load all users from API on mount
 * - Reload users when language changes (for translated content)
 * - Provide user state and dispatch to consuming components
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Context provider wrapping children
 */
export const UserProvider = ({ children }) => {
  const { i18n } = useTranslation();
  const [userState, dispatch] = useReducer(userReducer, initial);

  // Fetch all users from API and update state
  const getAllUsers = async () => {
    const response = await getAllUserService();
    dispatch({ type: "SET_ALL_USERS", payload: response.data.users });
  };

  // Load users on component mount
  useEffect(() => {
    getAllUsers();
  }, []);

  // Reload users when language changes (for translated content)
  useEffect(() => {
    const handleLanguageChange = async () => {
      try {
        await getAllUsers();
      } catch (error) {
        console.error("Error reloading users on language change:", error);
      }
    };

    // Listen for language changes
    i18n.on("languageChanged", handleLanguageChange);

    // Cleanup: remove listener on unmount
    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, [i18n]);

  return (
    <UserContext.Provider value={{ userState, dispatch }}>
      {children}
    </UserContext.Provider>
  );
};

/**
 * useUser Hook - Access user context from any component
 * 
 * @returns {Object} User context with userState and dispatch
 * @throws {Error} If used outside UserProvider
 */
export const useUser = () => useContext(UserContext);
