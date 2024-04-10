import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dbHandler from "../../backend/dbHandler";
import { getMyHandle, tryResumeSession } from "../../lib/bsky.ts"; // Import getMyHandle function

const FetchPostsFromDatabase = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isAuthenticated = await tryResumeSession();
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        const userHandle = getMyHandle(); // Get the logged-in user's handle
        const userData = await dbHandler({
          collectionName: "posts",
        }).getAllData(userHandle); // Fetch posts for the user handle

        console.log("User Handle:", userHandle);
        console.log("User Posts:", userData);
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this effect runs only once after initial render

  const exportToJsonFile = (filename) => {
    if (userData) {
      const json = JSON.stringify(userData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a); // Ensure anchor element is added to the DOM
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a); // Clean up: remove anchor element from the DOM
    } else {
      console.error("No data available to export.");
    }
  };

  const handleExportButtonClick = () => {
    // Call exportToJsonFile function when the button is clicked
    exportToJsonFile("postsData.json");
  };

  return (
    <div>
      {/* Button text changed to indicate file export */}
      <button
        style={{ marginLeft: "10px" }}
        className="secondary-button"
        onClick={handleExportButtonClick} // Call handleExportButtonClick function when button is clicked
      >
        Export Posts
      </button>
    </div>
  );
};

export default FetchPostsFromDatabase;
