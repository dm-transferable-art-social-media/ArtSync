import React, { useState } from "react";
import Heading from "../../Heading";
import { postText } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import "../Styles/createPost.css";

const PostsUpload = () => {
  const [posts, setPosts] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const fileContent = reader.result;
      const startIndex = fileContent.indexOf("[");

      if (startIndex !== -1) {
        const postsData = JSON.parse(fileContent.substring(startIndex));
        const posts = postsData.map((item) => item.post); 
        setUploadedFileName(file.name);
        setPosts(posts);

        // Create posts for each post
        await createPostsFromPosts(postsData); // Corrected function call
      } else {
        console.error("Invalid JSON format in the file.");
      }
    };

    reader.readAsText(file);
  };

  const createPostsFromPosts = async (postsData) => {
    try {
      for (const postItem of postsData) {
        const post = postItem.post;
        const text = post.record.text;
        const createdAt = post.record.createdAt;
  
        // Create a new post with both text and original creation date
        await postText({ text, created_at: createdAt });
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
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <p>{post.record.text}</p>
            <p>Created at: {post.record.createdAt}</p>
          </div>
        ))}
      </div>
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default PostsUpload;
