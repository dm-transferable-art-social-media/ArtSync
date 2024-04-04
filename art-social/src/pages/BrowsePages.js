import React, { useState, useEffect } from "react";
import { getCustomFeed } from '../lib/bsky.ts';
import style from './styles/browse.module.css';
import Post from "./components/Post.js";
import Browse from "./Browse.js";
import { feedTypes } from "./assets/feedTypes.js";
import { useParams } from "react-router-dom";

const BrowsePages = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
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

    return (
        <div>
            <Browse />
            <div className={style.container}>
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {posts.map((single) => (
                            <li key={single.post.cid}>
                                <Post
                                    postItem={single} >
                                </Post>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default BrowsePages;