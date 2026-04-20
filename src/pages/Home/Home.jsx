// Styling
import "./Home.css";
import React from "react";
import { useState, useMemo } from "react";
// Animation library: reveals elements with effect on scroll/mount
import { AttentionSeeker } from "react-awesome-reveal";
// Icons
import { TbAdjustmentsHorizontal } from "react-icons/tb";
// Multi-language support
import { useTranslation } from 'react-i18next';

// Context providers
import { usePosts } from "../../contexts/PostsProvider.jsx"; // Global posts state from database
// Components
import { Post } from "../../components/Post/Post"; // Post card component
import { Navbar } from "../../components/Navbar/Navbar"; // Top navigation bar
import { Header } from "../../components/Header/Header"; // Header component (not used currently)
import { StatsPanel } from "../../components/StatsPanel/StatsPanel"; // Stats sidebar
// Static data: feed posts from Excel sheet
import feedDataRaw from "./FeedData.json";

/**
 * Home page: main feed displaying posts from followed accounts and static feed posts
 * Features: post sorting (Latest/Oldest/Trending), combined feeds, multi-language support
 */
export const Home = () => {
  // Multi-language: current language and t() for translations
  const { t, i18n } = useTranslation();
  // Posts context: setSortBy function, current sortBy, all posts, loading state
  const { setSortBy, sortBy, allPosts, postLoading } = usePosts();

  // Memoized: static feed posts from Excel (language-dependent)
  // Uses FeedData.json which has translations for each language (es, en, fi, sr)
  // Resolves image URLs and formats posts for display
  const feedPosts = useMemo(() => {
    // Get current language (e.g., 'es', 'en')
    const lang = i18n.language?.slice(0, 2) || "en";
    // Get entries for current language from FeedData.json
    const entries = feedDataRaw[lang] || [];

    // Helper: resolve image URL from Excel cell (can be string or hyperlink object)
    const resolveImageUrl = (imageURL) => {
      if (!imageURL) return "";
      if (typeof imageURL === "string") return imageURL;
      if (imageURL.hyperlink) return imageURL.hyperlink;
      return "";
    };

    // Transform raw Excel entries into Post format
    return entries.map((item, idx) => {
      const imageUrl = resolveImageUrl(item.imageURL);
      return {
        _id: `feed-${idx}`,
        content: item.text,
        mediaUrl: imageUrl,
        type: imageUrl ? "image" : "",
        username: item.handle,
        firstName: item.firstName,
        lastName: item.lastName,
        _feedAvatarURL: item.imageUser || "",
        // Parse date from Excel: validate and convert to ISO format
        createdAt: (() => { const d = new Date(item.date); return item.date && !isNaN(d) ? d.toISOString() : new Date().toISOString(); })(),
        // Likes structure with count and likedBy array
        likes: { likeCount: item.likes ?? "0", likedBy: [] },
        comments: [],
        // Mark as feed post to distinguish from database posts
        _isFeedPost: true,
      };
    });
  }, [i18n.language]);


  // Accounts to show posts from (followed accounts from database)
  const FEED_DB_ACCOUNTS = ["lau_tech", "marti.dev", "alex_data", "sofia_analysis"];
  // Filter database posts: only include posts from followed accounts
  const filteredPosts = (allPosts || []).filter(post => FEED_DB_ACCOUNTS.includes(post.username));
  // Remove duplicate feed posts: if a feed post already exists in database posts, keep database version
  const feedPostsFiltered = feedPosts.filter(feedPost => !filteredPosts.some(p => p._id === feedPost._id));
  // Combine database posts and static feed posts (database posts first to prioritize real data)
  const allPostFromFollowers = [...filteredPosts, ...feedPostsFiltered];

  // Helper: parse like count string (e.g., "1.5k" -> 1500, "2m" -> 2000000)
  const parseLikeCount = (val) => {
    if (typeof val === "number") return val;
    // Parse string format: "1.5k", "2m", or plain numbers
    const s = String(val ?? "0").trim().toLowerCase();
    if (s.endsWith("m")) return parseFloat(s) * 1_000_000;
    if (s.endsWith("k")) return parseFloat(s) * 1_000;
    return parseFloat(s) || 0;
  };

  // Sort posts by selected criteria (Latest, Oldest, Trending)
  // Community Note posts always appear first (pinned)
  const sortedPosts = (sortBy, allPosts) => {
    // Separate community notes (pinned) from regular posts
    const pinned = allPosts.filter((p) => p.isCommunityNote);
    const rest = allPosts.filter((p) => !p.isCommunityNote);

    // Apply sort logic based on sortBy value
    if (sortBy === "Latest" || sortBy === t('home.sortBy.latest')) {
      // Newest posts first
      rest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Oldest" || sortBy === t('home.sortBy.oldest')) {
      // Oldest posts first
      rest.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      // Trending: most liked first
      rest.sort((a, b) => parseLikeCount(b.likes.likeCount) - parseLikeCount(a.likes.likeCount));
    }
    // Return pinned posts first, then sorted rest
    return [...pinned, ...rest];
  };

  // UI state: dropdown menu for sort options
  const [isAjustmentOn, setIsAdjustmentOn] = useState(false);
  // Available sort options with translated labels
  const sortTypes = [
    { key: "Trending", label: t('home.sortBy.trending') },
    { key: "Oldest", label: t('home.sortBy.oldest') },
    { key: "Latest", label: t('home.sortBy.latest') }
  ];

  // Helper: get translated label for current sort type
  const getCurrentSortLabel = () => {
    const currentSort = sortTypes.find(type => type.key === sortBy);
    return currentSort ? currentSort.label : sortBy;
  };

  return (
    <>
      {/* Main container with navbar */}
      <div className="app-container">
        <Navbar />

        <main className="feed">
          {/* Sorting container with dropdown menu */}
          <div className="sorting-container">
            {/* Display current sort label next to posts label */}
            <p>{t('home.sortBy.posts')}  {getCurrentSortLabel()} </p>
            {/* Sort button: toggle dropdown visibility */}
            <TbAdjustmentsHorizontal
              onClick={() => setIsAdjustmentOn(!isAjustmentOn)}
              className="adjustment-btn"
            />
            {/* Dropdown menu: show only when isAjustmentOn is true */}
            {isAjustmentOn && (
              <div className="dropdown-list-container">
                <ul>
                  {/* Map each sort type with animated effect */}
                  {sortTypes.map((type) => (
                    <AttentionSeeker
                      key={type.key}
                      duration={1000}
                      effect="headShake"
                    >
                      {/* Sort option: click to change sort and close dropdown */}
                      <li
                        className={type.key === sortBy ? "isActive" : ""}
                        onClick={() => {
                          setSortBy(type.key);
                          setIsAdjustmentOn(!isAjustmentOn);
                        }}
                        key={type.key}
                      >
                        {type.label}
                      </li>{" "}
                    </AttentionSeeker>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Post listing section: shows feed posts sorted by selected criteria */}
          {!postLoading && (
            <div className="post-listing-container">
              {/* Render posts if available, otherwise show "no posts" message */}
              {sortedPosts(sortBy, allPostFromFollowers).length ? (
                sortedPosts(sortBy, allPostFromFollowers)?.map((post) => {
                  return <Post key={post?._id} post={post} />;
                })
              ) : (
                <p className="no-bookmarks">
                  {t('home.noPosts')}
                </p>
              )}
            </div>
          )}
        </main>

        {/* Statistics sidebar: displays user stats (followers, posts, etc.) */}
        <aside className="stats-sidebar">
          {/* Stats panel component showing profile statistics */}
          <StatsPanel />
        </aside>
      </div>
    </>
  );
};
