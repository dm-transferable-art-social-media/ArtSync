import React, { useState, useEffect } from "react";
import { getCustomFeed, getAuthorFeed, deletePost, getMyHandle } from '../lib/bsky.ts';
import style from './Styles/browse.module.css';
import Post from "./components/Post.js";
import Browse from "./Browse.js";
import TimelineView from "./components/TimelineView.js";
import GridView from "./components/GridView.js";
import { feedTypes } from "./assets/feedTypes.js";
import { useParams } from "react-router-dom";
import { useView } from "./components/Context/ToggleView.js";

const BrowsePages = () => {
    const { view } = useView();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userHandle, setUserHandle] = useState("");
    const {type} = useParams();
    const uri = feedTypes[type].URI;

    useEffect(() => {
        async function fetchData() {
            try {
                getCustomFeed(uri, 30)
                    .then(data => {
                        setPosts(data);
                        setLoading(false);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            } catch (error) {
                console.error("Error fetching feed posts:", error);
                setLoading(false);
            }
        }
        fetchData();
    }, [uri]);

    async function fetchHandle() {
        try {
          setUserHandle(await getMyHandle());
        } catch (error) {
          console.error("Error fetching user handle:", error);
        }
      }

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
            <Browse />
            <div className={style.container}>
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

export default BrowsePages;