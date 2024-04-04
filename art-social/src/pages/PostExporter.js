//not currently used backup to export posts to json go to FetchPostsFromDatabase to find export code
import React from "react";

const PostExporter = ({ posts }) => {
  const downloadJsonFile = () => {
    const json = JSON.stringify(posts, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "posts.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      style={{ marginLeft: "10px" }}
      className="secondary-button"
      onClick={downloadJsonFile}
    >
      Export Posts as JSON
    </button>
  );
};

export default PostExporter;
