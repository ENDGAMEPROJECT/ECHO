import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { RxCross2 } from "react-icons/rx";
import "./SurveyModal.css";

/**
 * Survey Modal Configuration
 * 
 * Defines the structure of the multi-step survey with different question types:
 * - "single-rating": Single question with rating scale (e.g., 1-5)
 * - "multi-rating": Multiple questions each with their own rating scale (e.g., 1-7)
 * - "text": Free-form text input for comments
 * 
 * Each section is fetched from translation keys: survey.{id}Title, survey.{id}Items, etc.
 */
const SECTIONS = [
  { id: "opinion", type: "single-rating", scale: 5 },
  { id: "learning", type: "multi-rating", scale: 7 },
  { id: "guess", type: "multi-rating", scale: 7 },
  { id: "comments", type: "text" },
];

/**
 * SurveyModal Component
 * 
 * A multi-step modal survey form for collecting user feedback.
 * Features:
 * - Progressive disclosure (one section per step)
 * - Multiple question types (rating scales and text input)
 * - Progress bar showing completion status
 * - Validation to require completion of sections before proceeding
 * - Previous/Next navigation
 * - Submit when all questions are answered
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onClose - Callback function when modal is closed (X button or overlay click)
 * @param {Function} props.onSubmit - Callback function when survey is submitted with answers object
 * @returns {JSX.Element} Modal overlay with survey form
 */
export const SurveyModal = ({ onClose, onSubmit }) => {
  // Translation hook for multilingual support
  const { t } = useTranslation();
  
  // Storage for all user answers: keys vary by question type
  // Format examples:
  // - Single rating: { "opinion": 4 }
  // - Multi rating: { "learning_item1": 5, "learning_item2": 3 }
  // - Text: { "comments": "User's feedback text" }
  const [answers, setAnswers] = useState({});
  
  // Current step in the survey (0 = first section, increments on "Next")
  const [currentStep, setCurrentStep] = useState(0);

  /**
   * Get current section configuration based on current step
   * Accesses SECTIONS array at currentStep index
   */
  const currentSection = SECTIONS[currentStep];
  
  /**
   * Check if we're on the last step of the survey
   * Used to show "Submit" button instead of "Next"
   */
  const isLastStep = currentStep === SECTIONS.length - 1;
  
  /**
   * Calculate progress bar percentage (0-100)
   * Formula: (current step + 1) / total steps * 100
   * +1 because steps are 0-indexed but we want to show 1/4, 2/4, etc.
   */
  const progress = ((currentStep + 1) / SECTIONS.length) * 100;

  /**
   * Validate if current section is complete based on its type
   * Requirements vary by question type:
   * - single-rating: Must have selected one rating value
   * - multi-rating: Must answer ALL items in the list
   * - text: Optional (always considered complete)
   * 
   * @returns {boolean} True if section requirements are met
   */
  const isSectionComplete = () => {
    const { id, type } = currentSection;

    switch (type) {
      case "single-rating":
        // Single rating complete if any value selected (not undefined)
        return answers[id] !== undefined;

      case "multi-rating": {
        // Multi rating complete if ALL items have been rated
        // Fetch items from translation with returnObjects: true to get object form
        const itemsKey = `survey.${id}Items`;
        const items = t(itemsKey, { returnObjects: true });
        // Guard: if items not found or not an object, consider complete
        if (!items || typeof items !== "object") return true;
        // Check that every item key has a corresponding answer
        const itemKeys = Object.keys(items);
        return itemKeys.every((key) => answers[`${id}_${key}`] !== undefined);
      }

      case "text":
        // Comments are optional, always return true
        return true;

      default:
        return true;
    }
  };

  // Memoized validation result - can proceed only if section is complete
  const canProceed = isSectionComplete();

  /**
   * Handler: Update answer for a single question
   * Used by both single-rating and multi-rating components
   * 
   * @param {string} questionId - Identifier for the question (e.g., "opinion" or "learning_item1")
   * @param {number} value - Rating value selected (1-5, 1-7, etc.)
   */
  const handleRatingChange = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  /**
   * Handler: Update answer for text input
   * Specifically for the comments section
   * 
   * @param {string} value - Text content entered in textarea
   */
  const handleTextChange = (value) => {
    setAnswers((prev) => ({ ...prev, comments: value }));
  };

  /**
   * Handler: Move to next survey section
   * Only proceeds if current section is complete (canProceed is true)
   * and currentStep is not at the end (before last step)
   */
  const handleNext = () => {
    if (currentStep < SECTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  /**
   * Handler: Move to previous survey section
   * Allows backtracking to previous answers for review/change
   * Disabled on first step to prevent going below step 0
   */
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /**
   * Handler: Submit the survey
   * Called when user clicks Submit button on final step
   * Passes complete answers object to onSubmit callback
   */
  const handleSubmit = () => {
    onSubmit(answers);
  };

  /**
   * Render single-rating question
   * Displays a single question with button options for each rating value
   * 
   * @param {string} sectionId - Section identifier (e.g., "opinion")
   * @param {number} scale - Max rating value (e.g., 5 for 1-5 scale)
   * @returns {JSX.Element} Single rating section with buttons
   */
  const renderSingleRating = (sectionId, scale) => {
    // Get range hint text from translations (e.g., "1 = Not at all, 5 = Extremely")
    const rangeText = t(`survey.${sectionId}Range`);
    
    return (
      <div className="survey-section">
        {/* Display hint explaining the scale */}
        <p className="survey-range-hint">{rangeText}</p>
        
        {/* Create buttons for each rating value (1 to scale) */}
        <div className="survey-rating">
          {Array.from({ length: scale }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              className={`survey-rating-btn ${answers[sectionId] === value ? "selected" : ""}`}
              onClick={() => handleRatingChange(sectionId, value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render multi-rating questions
   * Displays multiple items, each with their own rating scale
   * Items are fetched from translation and displayed in scrollable list
   * 
   * @param {string} sectionId - Section identifier (e.g., "learning")
   * @param {number} scale - Max rating value for each item
   * @returns {JSX.Element} Multi-item rating section with scrollable list, or null if items not found
   */
  const renderMultiRating = (sectionId, scale) => {
    // Get the items object from translations (e.g., { "item1": "Learning effectiveness", "item2": "Fun factor" })
    const itemsKey = `survey.${sectionId}Items`;
    const items = t(itemsKey, { returnObjects: true });
    
    // Get generic range hint (applies to all items in this section)
    const rangeText = t("survey.rateRange");

    // Guard: if items not found or not object type, render nothing
    if (!items || typeof items !== "object") return null;

    // Convert items object to array of [key, text] pairs for mapping
    const itemEntries = Object.entries(items);

    return (
      <div className="survey-section survey-section--scrollable">
        {/* Display hint explaining the scale */}
        <p className="survey-range-hint">{rangeText}</p>
        
        {/* List of items to rate */}
        <div className="survey-items-list">
          {itemEntries.map(([key, text]) => {
            // Combine section id and item key to create unique question id
            const questionId = `${sectionId}_${key}`;
            // Check if this specific item has been answered
            const isAnswered = answers[questionId] !== undefined;
            
            return (
              <div key={key} className={`survey-item ${!isAnswered ? "survey-item--unanswered" : ""}`}>
                {/* Item question text */}
                <p className="survey-item-text">{text}</p>
                
                {/* Rating buttons for this item (1 to scale) */}
                <div className="survey-item-rating">
                  {Array.from({ length: scale }, (_, i) => i + 1).map((value) => (
                    <button
                      key={value}
                      className={`survey-rating-btn survey-rating-btn--small ${answers[questionId] === value ? "selected" : ""}`}
                      onClick={() => handleRatingChange(questionId, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * Render text input section
   * Displays textarea for optional user comments
   * 
   * @returns {JSX.Element} Text input section with textarea
   */
  const renderTextInput = () => {
    return (
      <div className="survey-section">
        <textarea
          className="survey-textarea"
          placeholder={t("survey.comments")}
          value={answers.comments || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={5}
        />
      </div>
    );
  };

  /**
   * Render appropriate section based on current section type
   * Routes to different render functions based on type
   * 
   * @returns {JSX.Element} Rendered section content or null if type unrecognized
   */
  const renderSection = () => {
    const { id, type, scale } = currentSection;

    switch (type) {
      case "single-rating":
        return renderSingleRating(id, scale);
      case "multi-rating":
        return renderMultiRating(id, scale);
      case "text":
        return renderTextInput();
      default:
        return null;
    }
  };

  /**
   * Get title for current section
   * For text section, returns the "comments" label
   * For rating sections, returns section-specific title from translations
   * 
   * @returns {string} Localized title text for current section
   */
  const getSectionTitle = () => {
    const { id, type } = currentSection;
    // Comments section uses generic label
    if (type === "text") {
      return t("survey.comments");
    }
    // Rating sections have custom titles (e.g., "How satisfied are you?")
    return t(`survey.${id}Title`);
  };

  return (
    // MODAL OVERLAY - Darkened background that closes modal when clicked
    <div className="survey-modal-overlay" onClick={onClose}>
      {/* MODAL CONTAINER - Main survey form (stops propagation to prevent closing when clicking inside) */}
      <div className="survey-modal" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON - X button in top-right corner */}
        <button className="survey-close-btn" onClick={onClose}>
          <RxCross2 />
        </button>

        {/* ═══════════════════════════════════════════════════
            SURVEY HEADER - Title, progress bar, step indicator
            ═══════════════════════════════════════════════════ */}
        <div className="survey-header">
          {/* Modal title */}
          <h2>{t("survey.title", "Share Your Feedback")}</h2>
          
          {/* Progress bar showing completion status */}
          <div className="survey-progress">
            <div className="survey-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          
          {/* Current step indicator (e.g., "1 / 4") */}
          <span className="survey-step-indicator">
            {currentStep + 1} / {SECTIONS.length}
          </span>
        </div>

        {/* ═══════════════════════════════════════════════════
            SURVEY CONTENT - Current section's question(s)
            ═══════════════════════════════════════════════════ */}
        <div className="survey-content">
          {/* Section title/question heading */}
          <h3 className="survey-question">{getSectionTitle()}</h3>
          {/* Render appropriate section based on currentStep */}
          {renderSection()}
        </div>

        {/* ═══════════════════════════════════════════════════
            SURVEY FOOTER - Navigation buttons and validation hint
            ═══════════════════════════════════════════════════ */}
        <div className="survey-footer">
          {/* Show validation error if section incomplete and user tries to proceed */}
          {!canProceed && (
            <span className="survey-required-hint">
              {t("survey.requiredHint", "Please answer all questions")}
            </span>
          )}
          
          {/* Navigation button container */}
          <div className="survey-footer-buttons">
            {/* Previous button - disabled on first step */}
            <button
              className="survey-nav-btn survey-prev-btn"
              onClick={handlePrev}
              disabled={currentStep === 0}
            >
              {t("survey.previous", "Previous")}
            </button>

            {/* Next or Submit button - depends on whether on last step */}
            {isLastStep ? (
              // SUBMIT button on last step - disabled if section incomplete
              <button
                className="survey-nav-btn survey-submit-btn"
                onClick={handleSubmit}
                disabled={!canProceed}
              >
                {t("survey.submit", "Submit")}
              </button>
            ) : (
              // NEXT button on intermediate steps - disabled if section incomplete
              <button
                className="survey-nav-btn survey-next-btn"
                onClick={handleNext}
                disabled={!canProceed}
              >
                {t("survey.next", "Next")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
