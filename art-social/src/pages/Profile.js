import React, { useState, useEffect } from "react";
import {
  getMyHandle,
  tryResumeSession,
  getAuthorFeed,
  deletePost,
  getProfile,
} from "../lib/bsky.ts";
import ProfileTimeline from "./components/ProfileTimeline.js";
import ProfileGrid from "./components/ProfileGrid";
import profileStyles from "./Styles/profileStyles.module.css";
import { useLocation, useNavigate } from "react-router-dom";

const Profile = () => {
  const [view, setView] = useState("grid");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    async function fetchData() {
      try {
        const [timeline] = await getAuthorFeed();
        setPosts(timeline);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setLoading(false);
      }
    }

    async function fetchHandle() {
      try {
        const userHandle = await getMyHandle();
        setHandle(userHandle);
      } catch (error) {
        console.error("Error fetching user handle:", error);
      }
    }

    async function fetchProfile() {
      try {
        const userProfile = await getProfile();
        setProfile(userProfile);
        console.log(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    async function initialize() {
      await tryResumeSession();
      await fetchHandle();
      await fetchData();
      await fetchProfile();
    }

    initialize();
  }, []); // Empty dependency array to run once on mount

  const handleDeletePost = async (uri) => {
    try {
      await deletePost({ uri });
      const [timeline] = await getAuthorFeed();
      setPosts(timeline);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
  const defaultBanner =
    "https://img.freepik.com/free-vector/stylish-hexagonal-line-pattern-background_1017-19742.jpg";

  return (
    <div>
      {/* user profile */}
      <div>
        <div className={profileStyles.imageThumbnailBox}>
          <img
            src={profile.avatar ? profile.avatar : defaultAvatar}
            className={profileStyles.imageThumbnail}
            alt="avatar"
          ></img>
        </div>
        <div className={profileStyles.imageThumbnailBox}>
          <img
            src={profile.banner ? profile.banner : defaultBanner}
            className={profileStyles.imageThumbnail}
            alt="banner"
          ></img>
        </div>
        <p>Handle: {handle}</p>
        <p>DisplayName: {profile.displayName}</p>
        <p>Description: {profile.description}</p>
        <p>Followers Count: {profile.followersCount}</p>
        <p>Follows Count: {profile.followsCount}</p>
        <p>Posts Count: {profile.postsCount}</p>
      </div>
      <button onClick={() => setView("grid")}>Switch to Grid View</button>
      <button onClick={() => setView("timeline")}>Switch to Timeline</button>
      <button onClick={() => navigate("/create", { replace: true })}>Create New Post</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {view === "timeline" && (
            <ProfileTimeline
              posts={posts}
              handleDeletePost={handleDeletePost}
            />
          )}
          {view === "grid" && (
            <ProfileGrid posts={posts} handleDeletePost={handleDeletePost} />
          )}
         
        </div>
      )}
    </div>
  );
};

export default Profile;
