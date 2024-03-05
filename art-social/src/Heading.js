import { useLocation, useNavigate } from "react-router-dom";
import { deleteSession } from "./lib/bsky.ts";
import heading from "./pages/styles/heading.module.css";

const Heading = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    deleteSession();
    navigate("/");
  };

  const tabs = [
    {
      routeName: "/home", // Change the routeName to include the full path
      label: "Home",
    },
    {
      routeName: "/notifications",
      label: "Notifications",
    },
    {
      routeName: "/search",
      label: "Search",
    },
    {
      routeName: "/profile",
      label: "Profile",
    },
    {
      routeName: "/settings",
      label: "Settings",
    },
    {
      routeName: "/upload",
      label: "Upload",
    },
  ];

  return (
    <div className="columns col-oneline p-2">
      <h1 className={heading.logo}>
        ArtSync
      </h1>

      <div>

        {location.pathname !== "/login" && (
          <ul className={heading.tab}>
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
            <li>{location.pathname !== "/login" && (
              <button className="btn btn-link col-ml-auto" onClick={logout}>
                Logout
              </button>
            )}</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Heading;
