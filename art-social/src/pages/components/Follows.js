import React from "react";

const Follows = ({ type, followers }) => {
    return (
        <div>
            {followers && followers.length > 0 ? (
                <ul>
                    {followers[0].map((follower, index) => (
                        <li key={index}>
                            {/* Using window.location.href to navigate and refresh */}
                            <a 
                                href={`/profile/${follower.handle}`}
                                onClick={() => window.location.reload()}
                            >
                                {follower.handle}
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                type === "followers" ? <p>You have no followers.</p> : <p>You're not following anyone.</p>
            )}
        </div>
    );
};

export default Follows;
