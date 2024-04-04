import React, { useState, useEffect } from "react";
import Post from "./components/Post.js";
import Browse from "./Browse.js";
import {
  getMyHandle,
  tryResumeSession,
  getTimeline,
  deletePost,
} from "../lib/bsky.ts";
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
    <div>
      <Browse />
      <div>
        {loading ? (
          <p>Loading posts...</p>
        ) : (
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
            {posts.map((single) => (
              <li key={single.post.cid}>
                {" "}
                {/* Assuming 'cid' is unique identifier for posts */}
                <Post
                  postItem={single}
                  userHandle={userHandle}
                  handleDeletePost={handleDeletePost}
                >
                </Post>
              </li>
            ))}
          </ul>
        )
        }
      </div>
    </div>
  );
}

export default Home;
