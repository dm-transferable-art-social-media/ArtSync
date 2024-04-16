import { useLocation, useNavigate } from "react-router-dom";
import style from "../pages/Styles/browse.module.css";
import { feedTypes } from "./assets/feedTypes";

const Browse = () => {
    const navigate = useNavigate();

    return (
        <div>
            <ul className={style.tab}>
                {Object.entries(feedTypes).map(([type, {title}]) => ( 
                    <li>
                        <button onClick={() => navigate("/browse/" + type, { replace: true })}>
                            {title}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Browse;
