import React from "react";
import TweetUpload from "./components/TweetUpload";
import PostsUpload from "./components/PostsUpload";
import FetchPostsFromDatabase from "./components/FetchPostsFromDatabase";

const UploadData = () => {
  return (
    <div>
      <TweetUpload />
      <PostsUpload />
    </div>
  );
};

export default UploadData;
