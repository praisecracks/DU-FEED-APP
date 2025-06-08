import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Setting from "./Conponents/Setting/Setting.jsx";
import Create from "./Conponents/Create/Create.jsx";
import Login from "./Conponents/Auth/Login.jsx";
import Home from "./Conponents/Home/Home.jsx";
import MyBlogs from "./Conponents/MyBlogs/MyBlogs.jsx";
import Profile from "./Conponents/Profile/Profile.jsx";
import Admin from "./Conponents/AdminPage/Admin.jsx";
import "./App.jsx";
import { Routes, Route } from "react-router-dom";
import AdminForm from "./Conponents/AdminPage/AdminForm.jsx";
import About from "./Conponents/About/About.jsx";
import UserBlog from "./Conponents/ViewUserBlog/UserBlog.jsx";
import Edit from "./Conponents/EditBlog/EditBlog.jsx";  // Keep this as Edit component
import UserProfile from "./Conponents/ViewUserProfile/UserProfile.jsx";
import CreateAdmin from "./Conponents/AdminCreationForm/CreateAdmin.jsx";

function App() {
  return (
    <div>
      <Routes>
        {/* USER ROUTES */}
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<Create />} />
        <Route path="/blogs" element={<MyBlogs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blog/:id" element={<UserBlog />} />
        <Route path="/about" element={<About />} />
        <Route path="/setting" element={<Setting />} />
        <Route path="/edit/:id" element={<Edit />} /> {/* Corrected this route */}
<Route path="/UserProfile/:userId" element={<UserProfile />} />
        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/adminform" element={<AdminForm />} />
        <Route path="/createAdmin" element={<CreateAdmin />} />

        {/* Fallback Route */}
        <Route path="*" element={<Home />} />
      </Routes>

      <ToastContainer />
    </div>
  );
}

export default App;
