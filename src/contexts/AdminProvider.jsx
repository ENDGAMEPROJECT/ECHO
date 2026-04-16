import React, { createContext, useContext, useState } from "react";

/**
 * AdminContext
 * 
 * React Context for managing admin user state and permissions.
 * Provides admin user information to all child components via useAdmin hook.
 */
const AdminContext = createContext();

/**
 * AdminProvider Component
 * 
 * Context provider that creates and supplies a default admin user to the entire application.
 * 
 * The admin user has:
 * - Full permissions to delete and moderate any content
 * - Special access to admin-only features (e.g., delete any post, edit any user)
 * - Cannot be blocked or restricted by normal users
 * 
 * This provider wraps the application (typically at the root level in App.jsx)
 * to make the admin context available throughout the entire component tree.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components that will have access to admin context
 * @returns {JSX.Element} Context provider wrapping children
 */
export const AdminProvider = ({ children }) => {
  /**
   * Default admin user object
   */
  const [admin] = useState({
    username: "admin",
    firstName: "Admin",
    lastName: "User",
    isAdmin: true,
  });

  return (
    // Provide admin context to all child components
    <AdminContext.Provider value={{ admin }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
