import React from "react";
import style from "../styles/timelinePost.module.css";

const Post = ({ postItem, handleDeletePost, userHandle }) => {
    const defaultAvatar =
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

    const displayName = postItem.post.author.displayName;
    const authorHandle = postItem.post.author.handle;
    const authorAvatar = postItem.post.author.avatar;
    const createdAt = postItem.post.record.createdAt;
    const postText = postItem.post.record.text;

    const extractHashtags = (text) => {
        const hashtags = text.match(/#\w+/g);
        return hashtags ? hashtags : [];
    };

    const renderPostContent = () => {
        const hashtags = extractHashtags(postText);
        const parts = postText.split(/#\w+/);
        return parts.map((part, index) => (
            <React.Fragment key={index}>
                {part}
                {index < hashtags.length && (
                    <span className={style.hashtag}>{hashtags[index]}</span>
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className={style.postContainer}>
            <img
                src={authorAvatar ? authorAvatar : defaultAvatar}
                className={style.postProfilePic}
                alt="avatar"
            ></img>
            <div className={style.postTop}>
                <div className={style.postDisplayName}>{displayName || authorHandle}</div>
                <div className={style.postHandle}>@{authorHandle}</div>
                <div className={style.postTime}>{new Date(createdAt).toLocaleDateString()}</div>
                { postItem.post.author.handle === userHandle && (
                    <div>
                        <button onClick={() => handleDeletePost(postItem.post.uri)}>
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <div className={style.postImage}>
                {postItem.post.embed && postItem.post.embed.images && postItem.post.embed.images[0] && (
                    <img
                        src={postItem.post.embed.images[0].fullsize}
                        alt="avatar"
                        className={style.postImage}
                    />
                )}
            </div>
            <div className={style.postText}>
                {renderPostContent()}
            </div>
        </div>
    );
};

export default Post;
