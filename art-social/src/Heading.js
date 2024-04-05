import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteSession } from "./lib/bsky.ts";
import heading from "./pages/styles/heading.module.css";
import logo from "../src/imgs/LogoWhite.png";

const Heading = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    deleteSession();
    navigate("/");
  };

  const tabs = [
    {
      routeName: "/home",
      label: "Home",
    },
    {
      routeName: "/notifications",
      label: "Notifications",
    },
    {
      routeName: "/profile",
      label: "Profile",
    },
    {
      routeName: "/upload",
      label: "Upload",
    },
  ];

  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className={heading.container}>
      <div>
        <ul className={heading.tab}>
          <li>
            <img src={logo} alt="Logo" className={heading.logo} />
          </li>
          {/* Navigation Tabs */}
          {tabs.map(({ routeName, label }, idx) => (
            <li
              key={idx}
              className={`tab-item ${location.pathname === routeName ? "active" : ""
                }`}
            >
              <button onClick={() => navigate(routeName, { replace: true })}>
                {label}
              </button>
            </li>
          ))}
          <li>
            {location.pathname !== "/login" && (
              <button className="btn btn-link col-ml-auto" onClick={logout}>
                Logout
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Heading;
