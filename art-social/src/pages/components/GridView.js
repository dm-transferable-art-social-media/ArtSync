import React from 'react';
import style from '../Styles/profileStyles.module.css';

const GridView = ({ posts }) => {
  // Ensure posts is defined and not null
  if (!posts) return null;

  // Filter posts with images
  const postsWithImages = posts.filter(post => post?.post?.embed?.images?.[0]);

  return (
    <ul className={style.gridContainer}>
      {postsWithImages.map(post => (
        <li key={post.post.cid} className={style.gridItem}>
          {post.post.embed && post.post.embed.images && post.post.embed.images[0] && (
            <div className={style.imageThumbnailBox}>
              <img
                src={post.post.embed.images[0].fullsize}
                className={style.imageThumbnail}
                alt={post.post.text} 
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default GridView;
