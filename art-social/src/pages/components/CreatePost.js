import React, { useState, useEffect } from "react";
import Heading from "../../Heading";
import { postText, agent } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import { tryResumeSession, getMyHandle } from "../../lib/bsky.ts";
import "../Styles/createPost.css";

const CreatePost = () => {
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

  useEffect(() => {
    checkAuthentication();
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
          const imageType = selectedImage.type.split("/")[1];
          const encoding = `image/${imageType}`;

          const imageUpload = await agent.uploadBlob(selectedImage, {
            encoding: encoding,
            mimeType: selectedImage.type,
          });

          if (imageUpload && imageUpload.success) {
            await postText({
              text: newPostText,
              images: [{ alt: "Image alt text", blob: selectedImage }],
            });
            setConfirmationMessage("New post with image created successfully!");
          } else {
            console.error("Error uploading image:", imageUpload.error);
            setConfirmationMessage("Error uploading image. Please try again.");
          }
        } else {
          await postText({ text: newPostText });
          setConfirmationMessage("New post created successfully!");
        }

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
