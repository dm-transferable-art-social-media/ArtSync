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
                  postItem={single} >
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
