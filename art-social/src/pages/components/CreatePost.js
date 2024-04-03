import React, { useState, useEffect } from "react";
import Heading from "../../Heading";
import { postText, agent } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import { tryResumeSession, getMyHandle, getCreatedAt } from "../../lib/bsky.ts";
import "../Styles/createPost.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import dbHandler from "../../backend/dbHandler";

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

  const uploadImageToStorage = async () => {
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${selectedImage.name}`);
      await uploadBytes(storageRef, selectedImage);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const createNewPost = async () => {
    try {
      if (newPostText !== "") {
        setUploading(true);

        // Check authentication
        const isAuthenticated = await tryResumeSession();
        if (!isAuthenticated) {
          navigate("/login");
          return;
        }

        let imageURL = "";
        let storagePath = ""; // Variable to store the path in Firebase Storage

        if (selectedImage) {
          // Upload image to Firebase Storage and get image URL
          imageURL = await uploadImageToStorage();

          // Get the storage path (without the bucket URL) from the imageURL
          const startIndex = imageURL.indexOf("/o/") + 3; // Index of the start of the path
          const endIndex = imageURL.indexOf("?alt="); // Index of the end of the path
          storagePath = imageURL.substring(startIndex, endIndex);
        }

        // Construct post data
        const postData = {
          text: newPostText,
          imageURL: imageURL,
          storagePath: storagePath, // Add the storage path to the post data
          createdAt: getCreatedAt(), // Assuming you have a function to get the current timestamp
        };

        // Post text and image to the server
        await postText({
          text: newPostText,
          images: selectedImage
            ? [{ alt: "Image alt text", blob: selectedImage }]
            : [],
        });

        // Store post data in Firestore
        await dbHandler({ collectionName: "posts" }).addData(
          getMyHandle(),
          postData
        );

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
