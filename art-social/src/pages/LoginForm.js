import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createSession } from "../lib/bsky.ts";

const LoginForm = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    identifier: "",
    password: "",
    hasError: false,
  });

  const login = async () => {
    const { success } = await createSession(state);
  
    setState((prevState) => ({ ...prevState, hasError: !success }));
  
    if (success) {
      navigate("/index"); 
    }
  };
  return (
    <div>
      <p>Minimal Bluesky Client for bsky.social</p>

      <form
        className={state.hasError ? "has-error" : ""}
        onSubmit={(e) => {
          e.preventDefault();
          login();
        }}
      >
        <div className="form-group">
          <label htmlFor="identifier">Identifier (email or handle)</label>
          <input
            id="identifier"
            value={state.identifier}
            onChange={(e) =>
              setState({
                ...state,
                identifier: e.target.value,
                hasError: false,
              })
            }
            className="form-input"
            type="text"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            value={state.password}
            onChange={(e) =>
              setState({ ...state, password: e.target.value, hasError: false })
            }
            className="form-input"
            type="password"
          />
        </div>

        {state.hasError && (
          <p className="form-input-hint">Invalid identifier or password.</p>
        )}

        <button type="submit" className="btn btn-primary">
          Take off
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
