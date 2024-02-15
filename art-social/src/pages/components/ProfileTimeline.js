import React from 'react';
import profileStyles from '../Styles/profileStyles.module.css';

const ProfileTimeline = ({posts, handleDeletePost}) => {

  return (
    <div>
      <h1>User Timeline</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.post.cid}>
                {post.post.embed && post.post.embed.images && post.post.embed.images[0] && (
                    <div className={profileStyles.imageThumbnailBox}>
                    <img src={post.post.embed.images[0].fullsize} className={profileStyles.imageThumbnail} alt="" />
                    </div>
                )}
              <p>{post.post.record.text}</p>
              <button onClick={() => handleDeletePost(post.post.uri)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
    </div>
  );
};

export default ProfileTimeline;