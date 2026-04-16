import "./Header.css";
import React from "react";
import { useNavigate } from "react-router-dom";
// Import attention-seeking animation effect from react-awesome-reveal
import { AttentionSeeker } from "react-awesome-reveal";
// Import translation hook for multi-language support
import { useTranslation } from 'react-i18next';
// Import utility function to resolve asset paths
import { assetPath } from "../../utils/assetPath";

/**
 * Header Component
 * 
 * Renders the application header with animated ECHO logo.
 * The logo serves as a clickable home button that navigates to the root page.
 * Uses an attention-seeking animation (swing effect) for visual appeal.
 * 
 * @returns {JSX.Element} The header component with animated logo
 */
export const Header = () => {
  // Get navigation function for routing
  const navigate = useNavigate();
  // Get translation function for localized strings (currently unused but available for future use)
  const { t } = useTranslation();

  return (
    // Header container
    <div className="header">
      {/* 
        Animated logo with swing effect
        Swings/sways to draw user attention to the header
      */}
      <AttentionSeeker effect="swing">
        {/* 
          ECHO logo image
          Clickable to navigate to home page (/)
        */}
        <img
          src={assetPath("/assets/echo-logo.png")}
          alt="ECHO logo"
          className="header-logo"
          onClick={() => navigate("/")}
        />
      </AttentionSeeker>
    </div>
  );
};
