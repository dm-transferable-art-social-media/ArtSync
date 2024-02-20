import React, { useState } from 'react';
import Heading from "../Heading";
import { postText } from "../lib/bsky.ts";
import { useLocation, useNavigate } from "react-router-dom";

const Settings = () => {
  const [newPostText, setNewPostText] = useState(""); // State to hold the text of the new post
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State to hold the confirmation message
  const navigate = useNavigate();
  // Handler for input change
  const handleInputChange = (event) => {
    setNewPostText(event.target.value);
  };

  // Handler for opening the popup
  const openPopup = () => {
    setShowPopup(true);
  };

  // Handler for closing the popup
  const closePopup = () => {
    setShowPopup(false);
    // Clear the input field when closing the popup
    setNewPostText("");
  };

  // Handler for creating a new post
  const createNewPost = async () => {
    try {
      if (newPostText !== ""){
        await postText({ text: newPostText }); // Call the postText function to create a new post
        setConfirmationMessage("New post created successfully!");
        // Optionally, you can add a success message or update the state to reflect the successful creation of the post
        console.log("New post created successfully!");
      }
      else{
        console.log("Nuh-uh! (An empty string was entered)");
      }
    } catch (error) {
      console.error("Error creating new post:", error);
      // Handle errors or display error messages if necessary
    }
  };

  return (
    <div>
      <Heading />
      <div>Settings page</div>
      <div>
      <button onClick={() => closePopup()}>Light Mode</button>
      <button onClick={() => openPopup()}>DARK MODE</button>
        {/* Button to open the popup <button onClick={() => navigate("/create", { replace: true })}>Create New Post</button>*/}
        {/* Popup for creating a new post */}
        {showPopup && (
          <p>lol</p>
        )}
      </div>
      {/* Confirmation message */}
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default Settings;
