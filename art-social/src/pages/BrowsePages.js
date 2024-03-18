import React, { useState, useEffect } from "react";
import HandleFollowers from './components/HandleFollowers';
import { getCustomFeed } from '../lib/bsky.ts';
import style from './styles/browse.module.css';
import Post from "./components/Post.js";

// const FeedsList = {
//     // mediums
//     digitalArt: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaaoxzvxrgczg",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaaoxzvxrgczg"
//     },
//     traditionalArt: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6plij2kys",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6plij2kys"
//     },
//     photography: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6pzvlasuo",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6pzvlasuo"
//     },
//     sculpture: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6qbxu5onk",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6qbxu5onk"
//     },
//     // art type
//     sketch: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6qkbmug5g",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6qkbmug5g"
//     },
//     painting: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6q23eigra",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6q23eigra"
//     },
//     illustration: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6rb54b7g6",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6rb54b7g6"
//     },
//     conceptArt: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6t5suv6du",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6t5suv6du"
//     },
//     // other
//     animeArt: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6wbdkgcpi",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6wbdkgcpi"
//     },
//     fanart: {
//         uri: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6wecf5liu",
//         link: "https://bsky.app/profile/did:plc:ag6k72dxale2rghqof7dedne/feed/aaae6wecf5liu"
//     }
// }

const FeedsList = {
    digitalArt: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaaoxzvxrgczg",
    traditionalArt: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6plij2kys",
    photography: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6pzvlasuo",
    sculpture: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6qbxu5onk",
    sketch: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6qkbmug5g",
    painting: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6q23eigra",
    illustration: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6rb54b7g6",
    conceptArt: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6t5suv6du",
    animeArt: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6wbdkgcpi",
    fanart: "at://did:plc:ag6k72dxale2rghqof7dedne/app.bsky.feed.generator/aaae6wecf5liu"
}

const BrowsePages = ({ type }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const uri = FeedsList[type];

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
    }, []);

    return (
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
    );
}

export default BrowsePages;