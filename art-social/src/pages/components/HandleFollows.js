import React, { useState } from "react";
import Heading from "../../Heading";
import { useNavigate } from "react-router-dom";
import {
    getMyHandle,
    tryResumeSession,
    getAuthorFeed,
    deletePost,
    getProfile,
    getFollows,
  } from "../../lib/bsky.ts";

  
const HandleFollows = () => {
  const handleFollowsClick= async () => {
    try {
      const response = await getFollows();
      console.log("Follows response:", response);
      
      if (Array.isArray(response[0])) {
        const follows = response[0];
        // Assuming each follower object has a property called "handle"
        const followsHandles = follows.map(follows => follows.handle);
        console.log("Follows handles:", followsHandles);
      } else {
        console.error("Invalid follows data:", response);
      }
    } catch (error) {
      console.error("Error fetching follows:", error);
    };
};


  return (
    <div>
      <Heading />
      <div>Follows</div>
      <div>
        <button onClick={handleFollowsClick}>Follows</button>
      </div>
    </div>
    
  );
};

export default HandleFollows;
