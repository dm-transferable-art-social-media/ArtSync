import React, { useState } from 'react';
import { createSession } from "../lib/bsky.ts";
import { useNavigate } from "react-router-dom";
import loginStyles from "./styles/login.module.css";
import heading from "./styles/heading.module.css";

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
      navigate("/home");
    }
  };

  const handleIdentifierChange = (e) => {
    setState({
      ...state,
      identifier: e.target.value,
      hasError: false,
    });
  };

  const handlePasswordChange = (e) => {
    setState({
      ...state,
      password: e.target.value,
      hasError: false,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className = {loginStyles["form-container"]}>
    <div className="columns col-oneline p-2">
      <h1 className={heading["logo"]}>
        ArtSync
      </h1>

      <form
        className={state.hasError ? "has-error" : ""}
        onSubmit={handleSubmit}
      >
        <div className={loginStyles["form-group"]}>
          <input
            id="identifier"
            value={state.identifier}
            onChange={handleIdentifierChange}
            className={loginStyles["form-input"]}
            type="text"
            placeholder="Identifier (email or handle)"
          />
        </div>

        <div className={loginStyles["form-group"]}>
          <input
            id="password"
            value={state.password}
            onChange={handlePasswordChange}
            className={loginStyles["form-input"]}
            type="password"
            placeholder="Password"
          />
        </div>

        {state.hasError && (
          <p className={loginStyles["form-input-hint"]}>Invalid identifier or password.</p>
        )}

        <button type="submit" className={loginStyles["form-button"]}>
          Sync Up
        </button>
      </form>
    </div>
    </div>
  );
};

export default LoginForm;
