import React, { useState, useEffect } from "react";
import Post from "./components/Post.js";
import Browse from "./Browse.js";
import {
  getMyHandle,
  tryResumeSession,
  getTimeline,
  deletePost,
} from "../lib/bsky.ts";
import TimelineView from "./components/TimelineView.js";
import GridView from "./components/GridView.js";
import { useView } from "./components/Context/ToggleView.js";

function Home() {
  const { view } = useView();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userHandle, setUserHandle] = useState("");

  useEffect(() => {
    fetchData();
    fetchHandle();
  }, []);

  async function fetchHandle() {
    try {
      const userHandle = getMyHandle();
      setUserHandle(userHandle);
    } catch (error) {
      console.error("Error fetching user handle:", error);
    }
  }

  async function fetchData() {
    try {
      // Attempt to resume session
      await tryResumeSession();

      // Fetch user timeline
      const [timeline] = await getTimeline({ limit: 2 + 10 })
      setPosts(timeline);
      console.log(timeline);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setLoading(false);
    }
  }

  const handleDeletePost = async (uri) => {
    try {
      await deletePost({ uri });
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div style={{ display: "flex" }}> {/* Container for Browse and Timeline/GridView */}
      <div style={{ flex: 1 }}> {/* Container for Browse */}
        <Browse />
      </div>
      <div style={{ flex: 10 }}> {/* Container for Timeline/GridView */}
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <div>
            {view === "Timeline" && (
              <TimelineView
                posts={posts}
                handleDeletePost={handleDeletePost}
                userHandle={userHandle}
              />
            )}
            {view === "Grid" && (
              <GridView posts={posts} handleDeletePost={handleDeletePost} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
