import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Heading from "./Heading.js";
import Footer from "./Footer.js";
import LoginForm from "./pages/LoginForm";
import Profile from "./pages/Profile.js";
import ProfileGrid from "./pages/components/ProfileGrid.js";
import ProfileTimeline from "./pages/components/ProfileTimeline.js";
import Notifications from "./pages/Notifications.js";
import Search from "./pages/Search.js";
import Settings from "./pages/Settings.js";
import CreatePost from "./pages/components/CreatePost.js";
import UploadData from "./pages/UploadData.js";
import Followers from "./pages/Followers.js";
import Follows from "./pages/Follows.js";


function App() {

  return (
    <BrowserRouter>
    <Heading />
      <Routes>
        <Route path="/" element={<LoginForm />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/notifications" element={<Notifications />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/profile/grid" element={<ProfileGrid />}></Route>
        <Route path="/profile/timeline" element={<ProfileTimeline />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/settings" element={<Settings />}></Route>
        <Route path="/create" element={<CreatePost />}></Route>
        <Route path="/upload" element={<UploadData />}></Route>
        <Route path="/followers" element={<Followers />}></Route>
        <Route path="/follows" element={<Follows />}></Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
