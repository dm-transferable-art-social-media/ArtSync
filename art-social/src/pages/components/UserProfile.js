import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tryResumeSession, getAuthorFeed, deletePost, getProfile, getMyHandle, getFollowers, getFollows } from "../../lib/bsky.ts";
import ProfileTimeline from "./ProfileTimeline.js";
import ProfileGrid from "./ProfileGrid";
import profileStyles from "../styles/profileStyles.module.css";
import followsStyles from "../styles/followsPopup.module.css"
import CreatePost from "./CreatePost.js";
import { defaultAvatar, defaultBanner } from "../assets/defaultImages.js";
import Follows from "./Follows.js";

const UserProfile = () => {
  const [view, setView] = useState("grid");
  const { handle } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userHandle, setUserHandle] = useState("");
  const [followers, setFollowers] = useState("");
  const [follows, setFollows] = useState("");
  const [profile, setProfile] = useState("");
  const [showFollows, setShowFollows] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const [timeline] = await getAuthorFeed({ actor: handle });
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
        setProfile(await getProfile({ actor: handle }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    async function fetchFollowers() {
      try {
        setFollowers(await getFollowers({ actor: handle }));
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    async function fetchFollows() {
      try {
        const follows2 = await getFollows({ actor: handle });
        setFollows(follows2);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }

    async function initialize() {
      await tryResumeSession();
      await fetchData();
      await fetchProfile();
      await fetchHandle();
      await fetchFollowers();
      await fetchFollows();
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

  const handleSwitchView = (viewType) => {
    setView(viewType);
  };

  const toggleFollows = () => {
    setShowFollows(!showFollows);
  };

  const toggleFollowers = () => {
    setShowFollowers(!showFollowers);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  }

  return (
    <div>
      {/* User profile */}
      <div className={profileStyles.imageContainer}>
        <div className={profileStyles.imageBannerBox}>
          <img
            src={profile.banner ? profile.banner : defaultBanner}
            className={profileStyles.imageThumbnail}
            alt="banner"
          />
        </div>
        <div className={profileStyles.imageProfileBox}>
          <img
            src={profile.avatar ? profile.avatar : defaultAvatar}
            className={profileStyles.imageThumbnail}
            alt="avatar"
          />
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
              <button className="third-button" onClick={toggleFollowers}>
                {profile.followersCount} Followers
              </button>
            </div>

            <div style={{ display: "flex" }}>
              <div className={profileStyles.profileText}>
                <button className="third-button" onClick={toggleFollows}>
                  {profile.followsCount} Following
                </button>
              </div>
            </div>

            <div style={{ marginLeft: "10px", paddingTop: "5px" }} className={profileStyles.profileText}>
              {profile.postsCount} Posts
            </div>
          </div>
        </div>
        <p></p>
        <div className="button-container">
          <button className="secondary-button" onClick={() => handleSwitchView("grid")}>
            Switch to Grid View
          </button>
          <button className="secondary-button" onClick={() => handleSwitchView("timeline")}>
            Switch to Timeline
          </button>


          <button className="primary-button" onClick={toggleUpload}>
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
      {showFollows && (
        <div className={followsStyles.popupContainer}>
          <div className={followsStyles.popupHeader}>
            <h2>Following</h2>
            <button className={followsStyles.closeButton} onClick={toggleFollows}>x</button>
          </div>
          <Follows type={"follows"} followers={follows} />
        </div>
      )}
      {showFollowers && (
        <div className={followsStyles.popupContainer}>
          <div className={followsStyles.popupHeader}>
            <h2>Followers</h2>
            <button className={followsStyles.closeButton} onClick={toggleFollowers}>x</button>
          </div>
          <Follows type={"followers"} followers={followers} />
        </div>
      )}

      {showUpload && (
        <div className={followsStyles.popupContainer}>
          <div className={followsStyles.popupHeader}>
            <h2>Create Post</h2>
            <button className={followsStyles.closeButton} onClick={toggleUpload}>x</button>
          </div>
          <CreatePost />
        </div>
      )}


    </div>
  );
};

export default UserProfile;
