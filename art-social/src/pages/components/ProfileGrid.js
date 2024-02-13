import React from 'react';
import profileStyles from '../Styles/profileStyles.module.css'


const ProfileGrid = ({posts, handleDeletePost}) => {

  return (
    <div>
      <h1>User Posts - Grid View</h1>
        <div className={profileStyles.gridContainer}>
          {posts.map((post) => (
            <div key={post.post.cid}>
                {post.post.embed && post.post.embed.images && post.post.embed.images[0] && (
                    <div className={profileStyles.imageThumbnailBox}>
                    <img src={post.post.embed.images[0].fullsize} className={profileStyles.imageThumbnail} alt="" />
                    </div>
                )}
              <p>{post.post.record.text}</p>
              <button onClick={() => handleDeletePost(post.post.uri)}>
                Delete
              </button>
            </div>
          ))}
        </div>
    </div>
  );
};

export default ProfileGrid;