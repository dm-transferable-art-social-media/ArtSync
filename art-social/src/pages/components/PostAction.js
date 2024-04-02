import React from "react";
import { heart, heartFilled } from "../assets/Icons.js";
import { like, unlike } from "../../lib/bsky.ts"

const PostAction = ({ uri, cid, likeCount }) => {
    let isLiked = false;

    const posturi = uri;
    const postcid = cid;
    async function handleLike() {
        try {
            await like({
                uri: posturi,
                cid: postcid
            });
            isLiked = true;
            console.log("hi" + isLiked);
        } catch (e) {
            console.error(e);
        }
    }

    const likeIcons = {
        unliked: heart,
        liked: heartFilled
    }

    return (
        <div>
            <button onClick={handleLike}>{isLiked ? likeIcons.liked : likeIcons.unliked}</button>
        </div>
    );
};

export default PostAction;