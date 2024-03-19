import React, { useState, useEffect } from "react";
import Heading from "../../Heading";
import { useNavigate } from "react-router-dom";
import {
  getMyHandle,
  tryResumeSession,
  getAuthorFeed,
  deletePost,
  getProfile,
  getFollowers,
} from "../../lib/bsky.ts";

const HandleFollowers = () => {
  const [followerHandles, setFollowerHandles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const response = await getFollowers();
        console.log("Followers response:", response);

        if (Array.isArray(response[0])) {
          const followers = response[0];
          // Assuming each follower object has a property called "handle"
          const handles = followers.map((follower) => follower.handle);
          console.log("Follower handles:", handles);
          setFollowerHandles(handles);
        } else {
          console.error("Invalid followers data:", response);
        }
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    // Call the fetchFollowers function when the component mounts
    fetchFollowers();

    // No need to include anything in the cleanup function because we're not setting up any subscriptions or intervals
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  return (
    <div>
      <div>Followers</div>
      <div>
        {followerHandles.length > 0 && (
          <ul>
            {followerHandles.map((handle, index) => (
              <li key={index}>{handle}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HandleFollowers;
