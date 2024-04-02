import React, { useState, useEffect } from "react";
import Heading from "../../Heading";
import { postText, agent } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import { tryResumeSession, getMyHandle } from "../../lib/bsky.ts";
import "../Styles/createPost.css";
import dbHandler from "../../backend/dbHandler.js";

const CreatePost = () => {
  const [handle, setHandle] = useState("");
  const [newPostText, setNewPostText] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setNewPostText(event.target.value);
  };

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };
  async function fetchHandle() {
    try {
      const userHandle = await getMyHandle();
      setHandle(userHandle);
    } catch (error) {
      console.error("Error fetching user handle:", error);
    }
  }

  useEffect(() => {
    checkAuthentication();
    fetchHandle(); // Fetch user handle when component mounts
  }, []);

  const checkAuthentication = async () => {
    try {
      const { success } = await tryResumeSession();
      if (!success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  };

  const createNewPost = async () => {
    try {
      if (newPostText !== "") {
        setUploading(true);
        const isAuthenticated = await tryResumeSession();
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        if (selectedImage) {
          // Upload image and create post with image
        } else {
          // Create post without image
          await postText({ text: newPostText });
          const post = {
            did: getMyHandle(), // Use the fetched user handle
            text: newPostText,
          };
          await dbHandler({ collectionName: "posts" }).addData(
            getMyHandle(),
            post
          );
        }
        setConfirmationMessage("New post created successfully!");
        setUploading(false);
      } else {
        console.log("Incomplete data for creating a post.");
      }
    } catch (error) {
      console.error("Error creating new post:", error);
      setConfirmationMessage("Error creating new post. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div className="container">
      <div className="heading">Create Post</div>
      <div className="form">
        <input
          type="text"
          value={newPostText}
          onChange={handleInputChange}
          placeholder="Enter text for the new post"
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/png, image/jpeg, image/jpg"
        />
        <div className="button-container-2">
          <button
            className="primary-button"
            onClick={createNewPost}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Create Post"}
          </button>
          <button
            className="secondary-button"
            onClick={() => navigate("/profile", { replace: true })}
          >
            Cancel
          </button>
        </div>
      </div>
      {confirmationMessage && (
        <div className="confirmation">{confirmationMessage}</div>
      )}
    </div>
  );
};

export default CreatePost;
