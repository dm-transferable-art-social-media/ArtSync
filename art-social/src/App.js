import logo from "./logo.svg";
import "./App.css";

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import LoginForm from "./pages/LoginForm";
import Heading from "./Heading.js";
import Profile from "./pages/Profile.js";
import ProfileGrid from "./pages/components/ProfileGrid.js";
import ProfileTimeline from "./pages/components/ProfileTimeline.js";
import Notifications from "./pages/Notifications.js";
import Search from "./pages/Search.js";
import Settings from "./pages/Settings.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginForm />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/notifications" element={<Notifications />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/profile/grid" element={<ProfileGrid />}></Route>
        <Route path="/profile/timeline" element={<ProfileTimeline />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
