import React, { useState, useEffect } from "react";
import {
  getMyHandle,
  tryResumeSession,
  getTimeline,
  deletePost,
} from "../lib/bsky.ts";
function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");

  useEffect(() => {
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

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchHandle() {
      try {
        const userHandle = getMyHandle();
        setHandle(userHandle);
      } catch (error) {
        console.error("Error fetching user handle:", error);
      }
    }

    fetchHandle();
  }, []);

  const handleDeletePost = async (uri) => {
    try {
      await deletePost({ uri });
      const [timeline] = await getTimeline({ limit: 10 });
      setPosts(timeline);
      console.log(posts);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <div>Home page</div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.post.cid}>
              {" "}
              {/* Assuming 'cid' is unique identifier for posts */}
              <p>{post.post.record.text}</p> {/* Accessing the text content */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
