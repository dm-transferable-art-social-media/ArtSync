import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getMyHandle,
  tryResumeSession,
  getAuthorFeed,
  deletePost,
} from '../lib/bsky.ts';
import Heading from '../Heading';
import ProfileTimeline from './components/ProfileTimeline';
import ProfileGrid from './components/ProfileGrid';

const Profile = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('grid');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [handle, setHandle] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const [timeline] = await getAuthorFeed();
        setPosts(timeline);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setLoading(false);
      }
    }

    async function fetchHandle() {
      try {
        const userHandle = await getMyHandle();
        setHandle(userHandle);
      } catch (error) {
        console.error('Error fetching user handle:', error);
      }
    }

    async function initialize() {
      await tryResumeSession();
      await fetchHandle();
      await fetchData();
    }

    initialize();
  }, []); // Empty dependency array to run once on mount

  const handleDeletePost = async (uri) => {
    try {
      await deletePost({ uri });
      const [timeline] = await getAuthorFeed();
      setPosts(timeline);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div>
      <Heading></Heading>
      <p>Handle: {handle}</p>
      <button onClick={() => setView('timeline')}>Switch to Timeline</button>
      <button onClick={() => setView('grid')}>Switch to Grid View</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {view === 'timeline' && (
            <ProfileTimeline posts={posts} handleDeletePost={handleDeletePost} />
          )}
          {view === 'grid' && (
            <ProfileGrid posts={posts} handleDeletePost={handleDeletePost} />
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
