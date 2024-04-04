import React, { useState, useEffect } from "react";
import { getMyHandle } from "../lib/bsky.ts";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [userHandle, setUserHandle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchHandle() {
      try {
        const handle = await getMyHandle();
        setUserHandle(handle);
        navigate(`/profile/${handle}`);
      } catch (error) {
        console.error("Error fetching user handle:", error);
      }
    }

    fetchHandle();
  }, []);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default Profile;
