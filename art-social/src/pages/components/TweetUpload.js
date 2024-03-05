import React, { useState } from "react";
import Heading from "../../Heading";
import { postText } from "../../lib/bsky.ts";
import { useNavigate } from "react-router-dom";

const TweetUpload = () => {
  const [tweets, setTweets] = useState([]);
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
        const tweetsData = eval(fileContent.substring(startIndex)); // Use eval to parse JS object notation
        const tweets = tweetsData.map((item) => item.tweet); // Extract tweet data from each item

        setUploadedFileName(file.name);
        setTweets(tweets);

        // Create posts for each tweet
        await createPostsFromTweets(tweets);
      } else {
        console.error("Invalid JSON format in the file.");
      }
    };

    reader.readAsText(file);
  };

  const createPostsFromTweets = async (tweetsData) => {
    try {
      for (const tweet of tweetsData) {
        const text = tweet.full_text;
        const createdAt = tweet.created_at;

        // Create a new post with both text and original creation date
        await postText({ text, created_at: createdAt });
      }
      setConfirmationMessage("Posts created successfully!");
    } catch (error) {
      console.error("Error creating posts:", error);
    }
  };

  return (
    <div>
      <Heading />
      <div>Upload Tweets</div>
      <input type="file" onChange={handleFileUpload} accept=".js" />
      {uploadedFileName && <div>Uploaded file: {uploadedFileName}</div>}
      <div>
        {tweets.map((tweet, index) => (
          <div key={index}>
            <p>{tweet.full_text}</p>
            <p>Created at: {tweet.created_at}</p>
          </div>
        ))}
      </div>
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default TweetUpload;
