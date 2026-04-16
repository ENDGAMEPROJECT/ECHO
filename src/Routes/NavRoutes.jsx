/**
 * NavRoutes: Central routing configuration for the application
 * 
 * Purpose: Defines all application routes and manages access control via protected route wrappers
 * Features: Multi-level route protection for progressive challenge access
 * Protected Routes:
 *   - /ai-content: Requires puzzle 1 (admin game) completion
 *   - /ai-incorrect-uses: Requires puzzle 1 AND puzzle 2 (AI content) completion
 */

import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
// Stats context: tracks challenge completion status for route protection
import { useStats } from "../contexts/StatsProvider";

// import { RequiresAuth } from "../components/RequiresAuth";  // Legacy auth wrapper (unused)

// Page imports: all routable page components in the application
import { Home } from "../pages/Home/Home";  // Feed display and main entry point
import { Profile } from "../pages/Profile/Profile";  // User profile with admin puzzle
import { PostDetail } from "../pages/PostDetail/PostDetail";  // Individual post details
import { Admin } from "../pages/Admin/Admin";  // Admin game: puzzle 1 (bot classification)
import { AIContent } from "../pages/AIContent/AIContent";  // Puzzle 2: AI content identification
import { AIIncorrectUses } from "../pages/AIIncorrectUses/AIIncorrectUses";  // Puzzle 3: AI misuse detection
import { Error } from "../pages/Error/Error";  // 404 error page for undefined routes

/**
 * ProtectedRoute: First-level route protection wrapper
 * 
 * Purpose: Prevents access to /ai-content until challenge2 (admin game) is completed
 * Logic: Checks challenge2InstructionsRead flag from stats context
 * Behavior:
 *   - If challenge2 not completed: redirects to /admin (forces puzzle 1 completion first)
 *   - If challenge2 completed: renders protected component (AIContent or its children)
 * 
 * @param {React.ReactNode} children - The route component to protect
 * @returns {React.ReactNode} Either the protected component or a redirect to /admin
 */
const ProtectedRoute = ({ children }) => {
  // Get puzzle 1 completion status from app stats
  const { challenge2InstructionsRead } = useStats();
  
  // Redirect to admin puzzle if not completed
  if (!challenge2InstructionsRead) {
    return <Navigate to="/admin" replace />;
  }
  
  // Grant access to protected component if requirements met
  return children;
};

/**
 * Challenge2ProtectedRoute: Second-level route protection wrapper
 * 
 * Purpose: Prevents access to /ai-incorrect-uses until challenge3 (AI content) is completed
 * Logic: Checks challenge3InstructionsRead flag from stats context
 * Behavior:
 *   - If challenge3 not completed: redirects to /ai-content (forces puzzle 2 completion)
 *   - If challenge3 completed: renders protected component (AIIncorrectUses)
 * Usage: Used INSIDE ProtectedRoute to create nested access control
 * 
 * @param {React.ReactNode} children - The route component to protect
 * @returns {React.ReactNode} Either the protected component or a redirect to /ai-content
 */
const Challenge2ProtectedRoute = ({ children }) => {
  // Get puzzle 2 completion status from app stats
  const { challenge3InstructionsRead } = useStats();

  // Redirect to ai-content puzzle if not completed
  if (!challenge3InstructionsRead) {
    return <Navigate to="/ai-content" replace />;
  }

  // Grant access to protected component if requirements met
  return children;
};

/**
 * NavRoutes: Main routing component using React Router
 * 
 * Purpose: Renders all application routes with protection wrappers for progressive challenges
 * Route Structure:
 *   - Public routes: /, /profile/:username, /post-detail/:postId, /admin, *
 *   - Protected route: /ai-content (requires puzzle 1 completion, wrapped by ProtectedRoute)
 *   - Double-protected route: /ai-incorrect-uses (requires puzzles 1 & 2, nested wrappers)
 * 
 * @returns {React.ReactElement} React Router Routes component with all application routes
 */
export const NavRoutes = () => {
  return (
    <Routes>
      {/* Home route: main feed display and application entry point */}
      <Route path="/" element={<Home />} />
      
      {/* Profile route: display user profile with admin puzzle controls
          Parameter: :username = target user profile to display */}
      <Route path="/profile/:username" element={<Profile />} />
      
      {/* Post detail route: display full post content and comments
          Parameter: :postId = specific post to view in detail */}
      <Route path="/post-detail/:postId" element={<PostDetail />} />
      
      {/* Admin puzzle route: puzzle 1 - bot classification game (unprotected, always accessible) */}
      <Route path="/admin" element={<Admin />} />
      
      {/* Protected route: AI content identification (puzzle 2)
          Protection: Requires admin puzzle completion (challenge2InstructionsRead)
          Redirect: To /admin if requirements not met */}
      <Route 
        path="/ai-content" 
        element={
          <ProtectedRoute>
            <AIContent />
          </ProtectedRoute>
        } 
      />
      
      {/* Double-protected route: AI misuse detection (puzzle 3)
          Protection: Requires BOTH admin puzzle AND ai-content puzzle completion
          Wrappers: Nested ProtectedRoute (puzzle 1 check) + Challenge2ProtectedRoute (puzzle 2 check)
          Redirect fallbacks: To /ai-content if puzzle 2 not complete, or /admin if puzzle 1 not complete */}
      <Route 
        path="/ai-incorrect-uses" 
        element={
          <ProtectedRoute>
            <Challenge2ProtectedRoute>
              <AIIncorrectUses />
            </Challenge2ProtectedRoute>
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback route: 404 error page for all undefined routes (catch-all) */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};
