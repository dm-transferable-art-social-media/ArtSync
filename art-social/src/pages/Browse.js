import { useLocation, useNavigate } from "react-router-dom";
import { deleteSession } from "../lib/bsky.ts";
import style from "../pages/styles/browse.module.css";

const Browse = () => {
    const location = useLocation();
    const navigate = useNavigate();

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
        },
        {
            routeName: "/browse/sketch",
            label: "Sketch",
        },
        {
            routeName: "/browse/painting",
            label: "Painting",
        },
        {
            routeName: "/browse/illustration",
            label: "Illustration",
        },
        {
            routeName: "/browse/conceptart",
            label: "Concept Art",
        },
        {
            routeName: "/browse/animeart",
            label: "Anime Art",
        },
        {
            routeName: "/browse/fanart",
            label: "Fanart",
        },
    ];

    // Add other routes that don't need heading here
    if (location.pathname === "/") {
        return null;
    }

    return (
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
                </ul>
            </div>
    );
};

export default Browse;
