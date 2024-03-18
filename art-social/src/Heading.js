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
    {
      routeName: "/followers",
      label: "Followers",
    },
  ];

  //Add other routes that don't need heading here
  if (location.pathname == "/"){
    return null;
  }

  return (
    <div className={heading.container} >
      <div>
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
      </div>
    </div>
  );
};

export default Heading;
