import { useLocation, useNavigate } from "react-router-dom";
import { deleteSession } from "../lib/bsky.ts";
import style from "../pages/styles/browse.module.css";

const Browse = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    deleteSession();
    navigate("/");
  };

  const tabs = [
    {
      routeName: "/browse/digitalart",
      label: "Digital Art",
    },
    {
      routeName: "/browse/traditionalart",
      label: "Traditional Art",
    },
    {
      routeName: "/browse/photography",
      label: "Photography",
    },
    {
      routeName: "/browse/sculpture",
      label: "Sculpture",
    }
  ];

  // Add other routes that don't need heading here
  if (location.pathname === "/") {
    return null;
  }

  return (
    <div className={style.logo}>
      <div>
          <ul className={style.tab}>
            {tabs.map(({ routeName, label }, idx) => (
              <li
                key={idx}
                className={`tab-item ${location.pathname === routeName ? "active" : ""}`}
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

export default Browse;
