import React, { useState, useEffect } from "react";
import {
  getMyHandle,
  tryResumeSession,
  getAuthorFeed,
  deletePost,
  getProfile,
  getFollowers,
  getCustomFeed,
} from "../lib/bsky.ts";
import ProfileTimeline from "./components/ProfileTimeline.js";
import ProfileGrid from "./components/ProfileGrid";
import profileStyles from "./Styles/profileStyles.module.css";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Profile = () => {
  const [view, setView] = useState("grid");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCustomFeed()
      .then((data) => {
        // Handle the data here
        console.log(data);
      })
      .catch((error) => {
        // Handle errors here
        console.error(error);
      });

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
      <div className={profileStyles.imageContainer}>
        <div className={profileStyles.imageBannerBox}>
          <img
            src={profile.banner ? profile.banner : defaultBanner}
            className={profileStyles.imageThumbnail}
            alt="banner"
          ></img>
        </div>
        <div className={profileStyles.imageProfileBox}>
          <img
            src={profile.avatar ? profile.avatar : defaultAvatar}
            className={profileStyles.imageThumbnail}
            alt="avatar"
          ></img>
        </div>
      </div>
      <div className={profileStyles.infoContainer}>
        <div>
          <div className={profileStyles.profileDisplayName}>
            {profile.displayName || handle}
          </div>
          <div className={profileStyles.profileHandle}>@{handle}</div>
          <div style={{ display: "flex" }}>
            <div className={profileStyles.profileText}>
              <button
                className="third-button"
                onClick={() => navigate("/followers", { replace: true })}
              >
                {" "}
                {profile.followersCount} Followers
              </button>
            </div>
            <div
              style={{ marginLeft: "10px" }}
              className={profileStyles.profileText}
            >
              <button
                className="third-button"
                onClick={() => navigate("/follows", { replace: true })}
              >
                {" "}
                {profile.followsCount} Following
              </button>
            </div>
            <div
              style={{ marginLeft: "10px", paddingTop: "5px" }}
              className={profileStyles.profileText}
            >
              {profile.postsCount} Posts
            </div>
          </div>
        </div>


        <p></p>
        <div className="button-container">
          <button className="secondary-button" onClick={() => setView("grid")}>
            Switch to Grid View
          </button>
          <button
            className="secondary-button"
            onClick={() => setView("timeline")}
          >
            Switch to Timeline
          </button>
          <button
            className="primary-button"
            onClick={() => navigate("/create", { replace: true })}
          >
            Create New Post
          </button>
        </div>


        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {view === "timeline" && (
              <ProfileTimeline
                posts={posts}
                handleDeletePost={handleDeletePost}
                userHandle={handle}
              />
            )}
            {view === "grid" && (
              <ProfileGrid posts={posts} handleDeletePost={handleDeletePost} />
            )}
          </div>
        )}
      </div>

    </div>

  );
};

export default Profile;
