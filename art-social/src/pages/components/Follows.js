import React from "react";

const Follows = ({ type, followers }) => {
  console.log(followers);
    return (
        <div>
            {followers && followers.length > 0 ? (
                <ul>
                    {followers[0].map((follower, index) => (
                        <li key={index}>{follower.handle}</li>
                    ))}
                </ul>
            ) : (
                type === "followers" ? <p>You have no followers.</p> : <p>You're not following anyone.</p>
            )}
        </div>
    );
};

export default Follows;
