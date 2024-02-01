import React, { useState, useEffect } from "react";
import {
  getMyHandle,
  tryResumeSession,
  getTimeline,
  getProfile,
  getAuthorFeed,
  deletePost,
} from "../lib/bsky.ts";
import Heading from "../Heading";
import profileStyles from './Styles/profileStyles.module.css';

function UserPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // Attempt to resume session
        await tryResumeSession();

        // Fetch user timeline
        const [timeline] = await getAuthorFeed();
        console.log(timeline);
        // Set fetched posts
        setPosts(timeline);
        console.log(posts[0]);
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
      const [timeline] = await getAuthorFeed();
      setPosts(timeline);
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <Heading></Heading>
      <h1>User Posts</h1>
      <p>Handle: {handle}</p>
      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.post.cid}>
              {" "}
              {/* Assuming 'cid' is unique identifier for posts */}
              <p> 
              {/* you may want to display images as thumbnail instead of fullsize.
              - currently only supports the first image */}
              {post.post.embed && post.post.embed.images && post.post.embed.images[0] && (
                <div className={profileStyles.imageThumbnailBox}>
                  <img src={post.post.embed.images[0].fullsize} className={profileStyles.imageThumbnail} alt="" />
                  </div>
              )}
                {post.post.record.text}</p> {/* Accessing the text content */}
              <button onClick={() => handleDeletePost(post.post.uri)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPosts;
