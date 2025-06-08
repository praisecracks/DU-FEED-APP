import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import ProfileImage from "../../Asset/admin.png";
import admin from "../../Asset/admin.png";
import domi from "../../Asset/dominion_logo.png";
import { AiOutlineHome, AiOutlineInfoCircle } from "react-icons/ai";
import { MdCreate, MdOutlineArticle } from "react-icons/md";
import { FaUserShield, FaUserPlus, FaSignInAlt } from "react-icons/fa";

function Header() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (currentUser) {
        try {
          const userRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setIsAdmin(userData.isAdmin || userData.role === "admin");
            setIsSubAdmin(userData.role === "subadmin");
          } else {
            console.log("User document does not exist!");
          }
        } catch (error) {
          console.error("Error fetching user data: ", error);
        }
      }
      setIsLoading(false);
    }
    fetchUserData();
  }, [currentUser]);

  console.log(currentUser);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const isLoggedIn = !!currentUser;

  return (
   <header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md bg-white/80 shadow-md transition-all duration-300">
  <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
    
    {/* Logo */}
    <Link to="/" className="flex items-center text-3xl font-bold tracking-wide ">
  <span style={{color: "#61593b"}} className="font-extrabold text-4xl font-serif">DU</span>
  <span className="ml-1 text-blue-600 font-sans">FEED</span>
  <span className="h-10 w-10"><img src={domi} alt="" /></span>
</Link>


    {/* Hamburger Menu */}
    <button
      onClick={toggleMenu}
      className="lg:hidden text-3xl text-indigo-700 hover:text-blue-600 transition-all"
    >
      <BsMenuButtonWide />
    </button>

    {/* Nav Links */}
    <nav
      className={`absolute lg:static top-full left-0 w-full lg:w-auto bg-white/95 backdrop-blur-sm border-t lg:border-none shadow-md lg:shadow-none transition-all duration-300 ease-in-out ${
        menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100"
      } overflow-hidden lg:overflow-visible`}
    >
      <ul className="flex flex-col lg:flex-row items-center lg:gap-6 gap-4 p-5 lg:p-0 text-gray-800 font-medium text-base">
        <li>
          <NavLink to="/home" className="flex items-center gap-2 hover:text-indigo-600 transition">
            <AiOutlineHome /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="flex items-center gap-2 hover:text-indigo-600 transition">
            <AiOutlineInfoCircle /> About
          </NavLink>
        </li>

        {isLoggedIn && (
          <>
            <li>
              <NavLink to="/create" className="flex items-center gap-2 hover:text-indigo-600 transition">
                <MdCreate /> Create
              </NavLink>
            </li>
            <li>
              <NavLink to="/blogs" className="flex items-center gap-2 hover:text-indigo-600 transition">
                <MdOutlineArticle /> My Blogs
              </NavLink>
            </li>
          </>
        )}

        {!isLoading && (isAdmin || isSubAdmin) && (
          <li>
            <NavLink to="/admin" className="flex items-center gap-2 hover:text-indigo-600 transition">
              <FaUserShield /> Admin Page
            </NavLink>
          </li>
        )}

        {!isLoading && isAdmin && (
          <li>
            <button
              onClick={() => navigate("/createadmin")}
              className="flex items-center gap-2 px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition duration-200"
            >
              <FaUserPlus />
              <img src={admin} alt="Admin Icon" className="w-5 h-5" />
            </button>
          </li>
        )}

        <li>
          <NavLink
            to={isLoggedIn ? "/profile" : "/login"}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition duration-300"
          >
            {isLoggedIn ? (
              <img
                src={currentUser?.photoURL || ProfileImage}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover border-2 border-white shadow"
              />
            ) : (
              <>
                <FaSignInAlt /> Login
              </>
            )}
          </NavLink>
        </li>
      </ul>
    </nav>
  </div>
</header>


  );
}

export default Header;
