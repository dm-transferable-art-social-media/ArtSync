import React, { useState } from 'react';
import Heading from '../../Heading';
import { postText } from '../../lib/bsky.ts';
import { useNavigate } from 'react-router-dom';

const TweetUpload = () => {
  const [tweets, setTweets] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const navigate = useNavigate();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      const fileContent = reader.result;
      const startIndex = fileContent.indexOf('[');
      
      if (startIndex !== -1) {
        const tweetsData = JSON.parse(fileContent.substring(startIndex));
        const tweets = tweetsData.map(item => item.tweet); // Extract tweet data from each item
        
        setUploadedFileName(file.name);
        setTweets(tweets);
      } else {
        console.error('Invalid JSON format in the file.');
      }
    };
  
    reader.readAsText(file);
  };
  
  return (
    <div>
      <Heading />
      <div>Upload Tweets</div>
      <input
        type="file"
        onChange={handleFileUpload}
        accept=".js"
      />
      {uploadedFileName && (
        <div>Uploaded file: {uploadedFileName}</div>
      )}
      <div>
        {tweets && tweets.map((tweet, index) => (
          <div key={index}>
            {tweet && tweet.full_text && (
              <>
                <p>{tweet.full_text}</p>
                <p>Created at: {tweet.created_at}</p>
              </>
            )}
          </div>
        ))}
      </div>
      {confirmationMessage && <div>{confirmationMessage}</div>}
    </div>
  );
};

export default TweetUpload;
