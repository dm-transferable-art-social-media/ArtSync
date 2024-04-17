import React, { useState, useEffect } from "react";
import { getCustomFeed, getMyHandle } from '../lib/bsky.ts';
import { feedTypes } from "./assets/feedTypes.js";
import { useParams } from "react-router-dom";
import Feed from "./components/Feed.js";

const BrowsePages = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userHandle, setUserHandle] = useState("");
    const { type } = useParams();
    const uri = feedTypes[type].URI;

    console.log(uri);

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
        console.log("Gfdss");
        fetchData();
        fetchHandle();
    }, [uri]);

    async function fetchHandle() {
        try {
            setUserHandle(await getMyHandle());
        } catch (error) {
            console.error("Error fetching user handle:", error);
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

export default BrowsePages;