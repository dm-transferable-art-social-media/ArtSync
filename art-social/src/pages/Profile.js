import React, {useState} from "react";
import { getMyHandle } from "../lib/bsky.ts";
import { useNavigate } from "react-router-dom";

// until we're able to store the handle across pages, this is the only way I can think of redirecting the user to their profile
const Profile = () => {
  const [userHandle, setUserHandle] = useState("");
  const navigate = useNavigate();

  fetchHandle();

  async function fetchHandle() {
    try {
      setUserHandle(await getMyHandle());
      navigate(`/profile/${userHandle}`);
    } catch (error) {
      console.error("Error fetching user handle:", error);
    }
  }


  const redirectToUserProfile = () => {
    navigate(`/profile/${userHandle}`);
  };

  return (
    <div>
      {/* Your Profile component content goes here */}
      <button onClick={redirectToUserProfile}>View Profile</button>
    </div>
  );
};

export default Profile;
