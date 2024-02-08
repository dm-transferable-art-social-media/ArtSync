import React, { useState } from 'react';
import Heading from "../Heading";
import { postText } from "../lib/bsky.ts";

const Settings = () => {
  const [newPostText, setNewPostText] = useState(""); // State to hold the text of the new post
  const [showPopup, setShowPopup] = useState(false); // State to control the visibility of the popup
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State to hold the confirmation message

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
        {/* Button to open the popup */}
        <button onClick={openPopup}>Create New Post</button>
        {/* Popup for creating a new post */}
        {showPopup && (
          <div className="popup">
            <input
              type="text"
              value={newPostText}
              onChange={handleInputChange}
              placeholder="Enter text for the new post"
            />
            <button onClick={createNewPost}>Create Post</button>
            <button onClick={closePopup}>Cancel</button>
          </div>
        )}
      </div>
      {/* Confirmation message */}
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default Settings;
