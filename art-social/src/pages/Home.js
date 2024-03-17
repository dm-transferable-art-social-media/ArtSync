import React, { useState, useEffect } from "react";
import Heading from "../Heading";
import timelineStyles from "./styles/timelinePost.module.css";
import Post from "./components/Post.js";
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

  const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <div>
      <div>Home page</div>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {posts.map((single) => (
            <li key={single.post.cid}>
              {" "}
              {/* Assuming 'cid' is unique identifier for posts */}
              <Post
                defaultAvatar={defaultAvatar}
                postItem={single} >
              </Post>
            </li>
          ))}
        </ul>
      )
      }
    </div >
  );
}

export default Home;
