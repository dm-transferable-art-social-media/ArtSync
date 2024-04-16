import React from "react";
import style from "../styles/timelinePost.module.css";
import "../styles/createPost.css";
import { Link } from "react-router-dom";
import { defaultAvatar } from "../assets/defaultImages";
import PostAction from "./PostAction.js";

const Post = ({ postItem, handleDeletePost, userHandle }) => {
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
      <Link to={"/profile/" + authorHandle}>
        <img
          src={authorAvatar ? authorAvatar : defaultAvatar}
          className={style.postProfilePic}
          alt="avatar"
        />
      </Link>
      <div className={style.postTop}>
        <Link to={"/profile/" + authorHandle} className={style.postDisplayName}>
          {displayName || authorHandle}
        </Link>
        <Link to={"/profile/" + authorHandle} className={style.postHandle}>
          @{authorHandle}
        </Link>
        <div className={style.postTime}>
          {new Date(createdAt).toLocaleDateString()}
        </div>
        {postItem.post.author.handle === userHandle && (
          <div>
            <button
              style={{ borderRadius: "10px", marginLeft: "10px" }}
              className="primary-button"
              onClick={() => handleDeletePost(postItem.post.uri)}
            >
              Delete
            </button>
          </div>
        )}
      </div>
      <div className={style.postImage}>
        {postItem.post.embed &&
          postItem.post.embed.images &&
          postItem.post.embed.images[0] && (
            <img
              src={postItem.post.embed.images[0].fullsize}
              alt="avatar"
              className={style.postImage}
            />
          )}
      </div>
      <div className={style.postText}>{renderPostContent()}</div>
      <div className={style.likeContainer}><PostAction uri={postItem.post.uri} cid={postItem.post.cid} likeCount={postItem.post.likeCount}></PostAction></div>
    </div>
  );
};

export default Post;