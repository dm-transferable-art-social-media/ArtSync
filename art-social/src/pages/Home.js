import React, { useState, useEffect } from "react";
import {
  getMyHandle,
  tryResumeSession,
  getTimeline,
} from "../lib/bsky.ts";
import Feed from "./components/Feed.js";

function Home() {
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
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      setLoading(false);
    }
  }

  return (
    <div>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <Feed posts={posts} userHandle={userHandle}></Feed>
        )}
    </div>
  );
}

export default Home;
