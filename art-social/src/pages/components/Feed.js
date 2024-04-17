import React, { useState, useEffect } from 'react';
import TimelineView from './TimelineView';
import GridView from './GridView';
import { useView } from './Context/ToggleView';
import { deletePost } from '../../lib/bsky.ts';

const Feed = ({ posts, userHandle }) => {
    const { view } = useView();
    const [updatedPosts, setUpdatedPosts] = useState(posts);
    console.log(posts);

    useEffect(() => {
        setUpdatedPosts(filterNSFW(posts));
    }, [posts]);

    const filterNSFW = (posts) => {
        return posts.filter((post) => {
            if (post.post.labels[0]){
                return post.post.labels[0].val != "sexual";
            }
            else{
                return post;
            }
        }
        );
    }

    const handleDeletePost = async (uri) => {
        try {
            await deletePost({ uri });
            const updatedPosts = updatedPosts.filter((post) => post.uri !== uri);
            setUpdatedPosts(updatedPosts);
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    return (
        <div>
            {view === 'Timeline' && (
                <TimelineView posts={updatedPosts} userHandle={userHandle} handleDeletePost={handleDeletePost} />
            )}
            {view === 'Grid' && <GridView posts={updatedPosts} userHandle={userHandle} />}
        </div>
    );
};

export default Feed;
