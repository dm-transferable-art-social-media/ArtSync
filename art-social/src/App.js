import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import Heading from "./Heading.js";
import Footer from "./Footer.js";
import LoginForm from "./pages/LoginForm";
import Notifications from "./pages/Notifications.js";
import CreatePost from "./pages/components/CreatePost.js";
import UploadData from "./pages/UploadData.js";
import BrowsePages from "./pages/BrowsePages.js";
import UserProfile from "./pages/components/UserProfile.js";
import Profile from "./pages/Profile.js";


function App() {

  return (
    <BrowserRouter>
      <Heading />
      <Routes>
        <Route path="/" element={<LoginForm />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/notifications" element={<Notifications />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create" element={<CreatePost />}></Route>
        <Route path="/upload" element={<UploadData />}></Route>
        <Route path="/browse/:type" element={<BrowsePages />}></Route>
        <Route path="/profile/:handle" element={<UserProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
