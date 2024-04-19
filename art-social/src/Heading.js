import React, {useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteSession } from "./lib/bsky.ts";
import heading from "./pages/Styles/heading.module.css";
import logo from "../src/imgs/LogoWhite.png";
import { useView } from "./pages/components/Context/ToggleView.js";
import Browse from "./pages/Browse.js";

const Heading = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [browse, setBrowse] = useState(true);
  const { view, toggleView } = useView();

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

  function toggleBrowse() {
    setBrowse(!browse)
  }

  return (
    <div>
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
              <button onClick={toggleBrowse}>
                Browse
              </button>
            </li>
            <li>
              <button onClick={toggleView}>
                {view} View
              </button>
            </li>
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
      {browse && <Browse />}
    </div>
  );
};

export default Heading;
