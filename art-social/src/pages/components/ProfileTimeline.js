import React from 'react';
import profileStyles from '../styles/profileStyles.module.css';
import timelineStyles from "../styles/timelinePost.module.css";
import Post from './Post';

const defaultAvatar =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const ProfileTimeline = ({ posts, handleDeletePost, userHandle }) => {

  return (
    <div>
      <h1>User Timeline</h1>
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {posts.map((single) => (
          <li key={single.post.cid}>
            <Post
              defaultAvatar={defaultAvatar}
              postItem={single} 
              handleDeletePost={handleDeletePost}
              userHandle={userHandle}>
            </Post>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileTimeline;