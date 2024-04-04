import React, { useState, useEffect } from "react";
import { getMyHandle } from "../lib/bsky.ts";
import { useNavigate } from "react-router-dom";

import "../App.css";
import PostExporter from "./PostExporter.js";
import dbHandler from "../backend/dbHandler.js";
import FetchPostsFromDatabase from "././components/FetchPostsFromDatabase.js"

const Profile = () => {
  const [userHandle, setUserHandle] = useState("");
  const { getAllData, getDataByDocID, addData } = dbHandler({ collectionName: 'users/' });
  const [view, setView] = useState("grid");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");
  const [profile, setProfile] = useState("");



  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHandle() {
      try {
        const handle = await getMyHandle();
        setUserHandle(handle);
        navigate(`/profile/${handle}`);
      } catch (error) {
        console.error("Error fetching user handle:", error);
      }
    }

    fetchHandle();
  }, []);

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
          <FetchPostsFromDatabase />
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
