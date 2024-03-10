import React, { useState, useEffect } from "react";
import Heading from "../../Heading";
import { postText, agent } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import { tryResumeSession, getMyHandle } from "../../lib/bsky.ts";

const CreatePost = () => {
  const [newPostText, setNewPostText] = useState(""); // State to hold the text of the new post
  const [selectedImage, setSelectedImage] = useState(null); // State to hold the selected image file
  const [confirmationMessage, setConfirmationMessage] = useState(""); // State to hold the confirmation message
  const [uploading, setUploading] = useState(false); // State to indicate whether an image is being uploaded
  const navigate = useNavigate();

  // Handler for input change
  const handleInputChange = (event) => {
    setNewPostText(event.target.value);
  };

  // Handler for image file selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]); // Only handle the first selected file
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const { success } = await tryResumeSession();
      if (!success) {
        // Redirect to the login page or handle the authentication failure
        navigate("/login");
      }
    } catch (error) {
      console.error("Authentication check failed:", error);
    }
  };

  const createNewPost = async () => {
    try {
      if (newPostText !== "") {
        setUploading(true); // Set uploading state to true during post creation
        const isAuthenticated = await tryResumeSession();
        if (!isAuthenticated) {
          // Redirect to the login page or handle the authentication failure
          navigate("/login");
          return;
        }

        if (selectedImage) {
          // If an image is selected, proceed with image upload
          // Dynamically determine the encoding and MIME type based on the file type
          const imageType = selectedImage.type.split("/")[1]; // Extract the file extension
          const encoding = `image/${imageType}`; // Construct the encoding value

          const imageUpload = await agent.uploadBlob(selectedImage, {
            encoding: encoding,
            mimeType: selectedImage.type, // Pass the MIME type here
          });

          // Check if image is uploaded successfully
          if (imageUpload && imageUpload.success) {
            await postText({
              text: newPostText,
              images: [{ alt: "Image alt text", blob: selectedImage }], // Pass the image data here
            });
            setConfirmationMessage("New post with image created successfully!");
          } else {
            console.error("Error uploading image:", imageUpload.error);
            setConfirmationMessage("Error uploading image. Please try again.");
          }
        } else {
          // If no image is selected, proceed without uploading an image
          await postText({ text: newPostText });
          setConfirmationMessage("New post created successfully!");
        }

        setUploading(false); // Reset uploading state after post creation
      } else {
        console.log("Incomplete data for creating a post.");
      }
    } catch (error) {
      console.error("Error creating new post:", error);
      // Handle errors or display error messages if necessary
      setConfirmationMessage("Error creating new post. Please try again.");
      setUploading(false); // Reset uploading state if an error occurs
    }
  };

  return (
    <div>
      <Heading />
      <div>Create Post</div>
      <div>
        <input
          type="text"
          value={newPostText}
          onChange={handleInputChange}
          placeholder="Enter text for the new post"
        />
        <input
          type="file"
          onChange={handleImageChange}
          accept="image/png, image/jpeg, image/jpg" // Allow only image files
        />
        <button onClick={createNewPost} disabled={uploading}>
          {uploading ? "Uploading..." : "Create Post"}
        </button>
        <button onClick={() => navigate("/profile", { replace: true })}>
          Cancel
        </button>
      </div>
      {/* Confirmation message */}
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default CreatePost;
