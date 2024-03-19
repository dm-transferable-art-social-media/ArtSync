import React, { useState, useEffect } from "react";
import Heading from "../../Heading";
import { useNavigate } from "react-router-dom";
import {
  getMyHandle,
  tryResumeSession,
  getAuthorFeed,
  deletePost,
  getProfile,
  getFollows, // Change this import
} from "../../lib/bsky.ts"; // Ensure the path to the bsky.ts file is correct

const HandleFollows = () => { // Change component name here
  const [followHandles, setFollowHandles] = useState([]); // Change state and function names accordingly
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFollows = async () => {
      try {
        const response = await getFollows(); // Change function call to getFollows
        console.log("Follows response:", response);

        if (Array.isArray(response[0])) {
          const follows = response[0];
          // Assuming each follow object has a property called "handle"
          const handles = follows.map((follow) => follow.handle); // Change variable names
          console.log("Follow handles:", handles);
          setFollowHandles(handles); // Change state setter function
        } else {
          console.error("Invalid follows data:", response);
        }
      } catch (error) {
        console.error("Error fetching follows:", error);
      }
    };

    // Call the fetchFollows function when the component mounts
    fetchFollows();

    // No need to include anything in the cleanup function because we're not setting up any subscriptions or intervals
  }, []); // Empty dependency array ensures this effect runs only once, similar to componentDidMount

  return (
    <div>
      <div>Following</div> {/* Change the title */}
      <div>
        {followHandles.length > 0 && (
          <ul>
            {followHandles.map((handle, index) => (
              <li key={index}>{handle}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default HandleFollows; // Change export name
