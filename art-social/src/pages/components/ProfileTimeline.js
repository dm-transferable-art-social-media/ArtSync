import React from 'react';
import profileStyles from '../styles/profileStyles.module.css';
import timelineStyles from "../styles/timelinePost.module.css";

const defaultAvatar =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const ProfileTimeline = ({posts, handleDeletePost}) => {

  return (
    <div>
      <h1>User Timeline</h1>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {posts.map((single) => (
            <li key={single.post.cid}>
                <div className = {timelineStyles.postContainer}>
                <img
                  src={defaultAvatar}
                  className={timelineStyles.postProfilePic}
                  alt="avatar"
                ></img>
                <div className = {timelineStyles.postTop}>
                  <div className = {timelineStyles.postDisplayName}>{single.post.author.displayName || single.post.author.handle}</div>
                  <div className = {timelineStyles.postHandle}>@{single.post.author.handle}</div>
                  <div className = {timelineStyles.postTime}>{new Date(single.post.record.createdAt).toLocaleDateString()}</div>
                </div>
                <div className = {timelineStyles.postText}>{single.post.record.text}</div> {/* Accessing the text content */}
                <div className = {timelineStyles.postImage}>
                  {single.post.embed && single.post.embed.images && single.post.embed.images[0] && (
                    <img
                      src={single.post.embed.images[0].fullsize}
                      alt="avatar"
                      className = {timelineStyles.postImage}
                    />
                  )}
                </div>
              </div>
              <button onClick={() => handleDeletePost(single.post.uri)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default ProfileTimeline;