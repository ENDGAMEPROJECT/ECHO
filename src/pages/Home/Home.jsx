import "./Home.css";
import React from "react";
import { useState, useMemo } from "react";
import { AttentionSeeker } from "react-awesome-reveal";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { useTranslation } from 'react-i18next';

import { usePosts } from "../../contexts/PostsProvider.jsx";
import { Post } from "../../components/Post/Post";
import { Navbar } from "../../components/Navbar/Navbar";
import { Header } from "../../components/Header/Header";
import { StatsPanel } from "../../components/StatsPanel/StatsPanel";
import feedDataRaw from "./FeedData.json";

export const Home = () => {
  const { t, i18n } = useTranslation();
  const { setSortBy, sortBy, allPosts, postLoading } = usePosts();

  // Posts estáticos del feed (hoja "feed" del Excel), según idioma activo
  const feedPosts = useMemo(() => {
    const lang = i18n.language?.slice(0, 2) || "en";
    const entries = feedDataRaw[lang] || [];

    const resolveImageUrl = (imageURL) => {
      if (!imageURL) return "";
      if (typeof imageURL === "string") return imageURL;
      if (imageURL.hyperlink) return imageURL.hyperlink;
      return "";
    };

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
        createdAt: (() => { const d = new Date(item.date); return item.date && !isNaN(d) ? d.toISOString() : new Date().toISOString(); })(),
        likes: { likeCount: item.likes ?? "0" },
        comments: [],
        _isFeedPost: true,
      };
    });
  }, [i18n.language]);


  // Mezcla posts del estado global con los del feed estático, evitando duplicados
  const FEED_DB_ACCOUNTS = ["lau_tech", "marti.dev", "alex_data", "sofia_analysis"];
  // Posts dinámicos (de la base de datos)
  const filteredPosts = (allPosts || []).filter(post => FEED_DB_ACCOUNTS.includes(post.username));
  // Evita duplicados: si un post del feed ya existe en allPosts (por _id), usa el de allPosts
  const feedPostsFiltered = feedPosts.filter(feedPost => !filteredPosts.some(p => p._id === feedPost._id));
  const allPostFromFollowers = [...filteredPosts, ...feedPostsFiltered];

  const parseLikeCount = (val) => {
    if (typeof val === "number") return val;
    const s = String(val ?? "0").trim().toLowerCase();
    if (s.endsWith("m")) return parseFloat(s) * 1_000_000;
    if (s.endsWith("k")) return parseFloat(s) * 1_000;
    return parseFloat(s) || 0;
  };

  const sortedPosts = (sortBy, allPosts) => {
    // Community Note siempre aparece la primera
    const pinned = allPosts.filter((p) => p.isCommunityNote);
    const rest = allPosts.filter((p) => !p.isCommunityNote);

    if (sortBy === "Latest" || sortBy === t('home.sortBy.latest')) {
      rest.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "Oldest" || sortBy === t('home.sortBy.oldest')) {
      rest.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      rest.sort((a, b) => parseLikeCount(b.likes.likeCount) - parseLikeCount(a.likes.likeCount));
    }
    return [...pinned, ...rest];
  };

  const [isAjustmentOn, setIsAdjustmentOn] = useState(false);
  const sortTypes = [
    { key: "Trending", label: t('home.sortBy.trending') },
    { key: "Oldest", label: t('home.sortBy.oldest') },
    { key: "Latest", label: t('home.sortBy.latest') }
  ];

  // Obtener la etiqueta traducida del tipo de orden actual
  const getCurrentSortLabel = () => {
    const currentSort = sortTypes.find(type => type.key === sortBy);
    return currentSort ? currentSort.label : sortBy;
  };

  return (
    <>

      <div className="app-container">
        <Navbar />

        <main className="feed">
          <div className="sorting-container">
            <p>{t('home.sortBy.posts')}  {getCurrentSortLabel()} </p>
            <TbAdjustmentsHorizontal
              onClick={() => setIsAdjustmentOn(!isAjustmentOn)}
              className="adjustment-btn"
            />
            {isAjustmentOn && (
              <div className="dropdown-list-container">
                <ul>
                  {sortTypes.map((type) => (
                    <AttentionSeeker
                      key={type.key}
                      duration={1000}
                      effect="headShake"
                    >
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

          {!postLoading && (
            <div className="post-listing-container">
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

        {/* Panel de estadísticas lateral */}
        <aside className="stats-sidebar">
          <StatsPanel />
        </aside>
      </div>
    </>
  );
};
