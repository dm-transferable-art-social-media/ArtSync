import React from 'react';
import Post from './Post';

const TimelineView = ({ posts, handleDeletePost, userHandle }) => {

  return (
      <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        {posts.map((single) => (
          <li key={single.post.cid}>
            <Post
              postItem={single} 
              handleDeletePost={handleDeletePost}
              userHandle={userHandle}>
            </Post>
          </li>
        ))}
      </ul>
  );
};

export default TimelineView;