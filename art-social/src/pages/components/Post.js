import React from "react";
import timelineStyles from "../styles/timelinePost.module.css";

const Post = ({ defaultAvatar, postItem, handleDeletePost, userHandle }) => {
    const displayName = postItem.post.author.displayName;
    const authorHandle = postItem.post.author.handle;
    const authorAvatar = postItem.post.author.avatar;
    const createdAt = postItem.post.record.createdAt;
    const postText = postItem.post.record.text;

    return (
        <div className={timelineStyles.postContainer}>
            <img
                src={authorAvatar? authorAvatar : defaultAvatar}
                className={timelineStyles.postProfilePic}
                alt="avatar"
            ></img>
            <div className={timelineStyles.postTop}>
                <div className={timelineStyles.postDisplayName}>{displayName || authorHandle}</div>
                <div className={timelineStyles.postHandle}>@{authorHandle}</div>
                <div className={timelineStyles.postTime}>{new Date(createdAt).toLocaleDateString()}</div>
                {postItem.post.author.handle == userHandle &&
                    <div>
                        <button onClick={() => handleDeletePost(postItem.post.uri)}>
                            Delete
                        </button>
                    </div>
                }
            </div>
            <div className={timelineStyles.postImage}>
                {postItem.post.embed && postItem.post.embed.images && postItem.post.embed.images[0] && (
                    <img
                        src={postItem.post.embed.images[0].fullsize}
                        alt="avatar"
                        className={timelineStyles.postImage}
                    />
                )}
            </div>
            <div className={timelineStyles.postText}>{postText}</div>
        </div>
    )
}

export default Post;