import React, { useState, useEffect } from "react";
import {
  tryResumeSession,
  getAuthorFeed,
  deletePost,
  getProfile,
  getMyHandle
} from "../../lib/bsky.ts";
import ProfileTimeline from "./ProfileTimeline.js";
import ProfileGrid from "./ProfileGrid";
import profileStyles from "../styles/profileStyles.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { defaultAvatar, defaultBanner } from "../assets/defaultImages.js";

const UserProfile = () => {
  const [view, setView] = useState("grid");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userHandle, setUserHandle] = useState("");
  const {handle} = useParams();
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [timeline] = await getAuthorFeed({actor: handle});
        setPosts(timeline);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setLoading(false);
      }
    }

    async function fetchHandle() {
      try {
        setUserHandle(await getMyHandle());
      } catch (error) {
        console.error("Error fetching user handle:", error);
      }
    }

    async function fetchProfile() {
      try {
        const userProfile = await getProfile({actor: handle});
        setProfile(userProfile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    async function initialize() {
      await tryResumeSession();
      await fetchData();
      await fetchProfile();
      await fetchHandle();
    }

    initialize();
  }, []);

  const handleDeletePost = async (uri) => {
    try {
      await deletePost({ uri });
      const [timeline] = await getAuthorFeed();
      setPosts(timeline);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

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
                handle={handle}
                userHandle={userHandle}
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

  // return (
  //   <div>Hello {handle} </div>
  // )
};


export default UserProfile;
