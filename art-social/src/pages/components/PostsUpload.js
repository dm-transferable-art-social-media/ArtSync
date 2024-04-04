import React, { useState } from "react";
import { postText } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const PostsUpload = () => {
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const fileContent = reader.result;
        const startIndex = fileContent.indexOf("[");

        if (startIndex !== -1) {
          const postsData = JSON.parse(fileContent.substring(startIndex));
          console.log("Parsed postsData:", postsData);
          setUploadedFileName(file.name);

          // Create posts for each post
          await createPostsFromPosts(postsData);
        } else {
          console.error("Invalid JSON format in the file.");
        }
      } catch (error) {
        console.error("Error parsing file content:", error);
      }
    };

    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };

    reader.readAsText(file);
  };

  const getImageBlob = async (storagePath) => {
    try {
      const storage = getStorage();
      const decodedStoragePath = decodeURIComponent(storagePath);
      const imageRef = ref(storage, decodedStoragePath);
      const downloadURL = await getDownloadURL(imageRef);
      const response = await fetch(downloadURL);
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error("Error fetching image blob:", error);
      throw error;
    }
  };

  const createPostsFromPosts = async (postsData) => {
    try {
      console.log("Posts:", postsData);
      for (const postData of postsData) {
        console.log("Creating post from data:", postData);
        const text = postData.text;
        const imageURL = postData.imageURL;
        const storageURL = postData.storagePath;
        console.log(storageURL);
        const createdAt = postData.createdAt;
        const userHandle = postData.userHandle;
        let images = [];

        // Check if the post data has imageURL property
        if (imageURL) {
          const imageBlob = await getImageBlob(storageURL);
          images.push({ alt: "Image alt text", blob: imageBlob });
          console.log("Image blob added to post:", imageBlob);
        }

        // Create a new post with text, images, and original creation date
        await postText({ text, images, createdAt });
        console.log("Post created successfully for data:", postData);
      }
      setConfirmationMessage("Posts created successfully!");
    } catch (error) {
      console.error("Error creating posts:", error);
    }
  };

  return (
    <div className="container">
      <div>Upload Posts</div>
      <input type="file" onChange={handleFileUpload} accept=".json" />
      {uploadedFileName && <div>Uploaded file: {uploadedFileName}</div>}
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default PostsUpload;
