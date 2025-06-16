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

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const isLoggedIn = !!currentUser;

  return (
<header className="w-full fixed top-0 left-0 z-50 backdrop-blur-md shadow-md transition-all duration-300 bg-white/70 dark:bg-black/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1 text-3xl font-bold tracking-wide">
          <span className="text-4xl font-serif font-extrabold text-[#61593b]">DU</span>
          <span className="text-blue-600 font-sans">FEED</span>
          <img src={domi} alt="Dominion logo" className="w-10 h-10 object-contain ml-2" />
        </Link>

        {/* Hamburger Menu */}
        <button
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="lg:hidden text-3xl text-indigo-700 hover:text-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
        >
          <BsMenuButtonWide />
        </button>

        {/* Nav Links */}
     <nav className={`absolute lg:static top-full left-0 w-full lg:w-auto bg-white dark:bg-gray-900 border-t lg:border-none shadow-md lg:shadow-none overflow-hidden transition-[max-height] duration-500 ease-in-out rounded ${
  menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 lg:max-h-full lg:opacity-100"
}`}>


          <ul className="flex flex-col lg:flex-row items-center lg:items-center lg:gap-6 gap-4 p-5 lg:p-0 text-gray-800 font-medium text-base">

            <li>
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  `flex items-center gap-2 transition ${
                    isActive ? "text-indigo-300 font-semibold" : "hover:text-indigo-600"
                  }`
                }
              >
                <AiOutlineHome /> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `flex items-center gap-2 transition ${
                    isActive ? "text-indigo-700 font-semibold" : "hover:text-indigo-600"
                  }`
                }
              >
                <AiOutlineInfoCircle /> About
              </NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <NavLink
                    to="/create"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition ${
                        isActive ? "text-indigo-700 font-semibold" : "hover:text-indigo-600"
                      }`
                    }
                  >
                    <MdCreate /> Create
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/blogs"
                    className={({ isActive }) =>
                      `flex items-center gap-2 transition ${
                        isActive ? "text-indigo-700 font-semibold" : "hover:text-indigo-600"
                      }`
                    }
                  >
                    <MdOutlineArticle /> My Blogs
                  </NavLink>
                </li>
              </>
            )}

            {!isLoading && (isAdmin || isSubAdmin) && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center gap-2 transition ${
                      isActive ? "text-indigo-700 font-semibold" : "hover:text-indigo-600"
                    }`
                  }
                >
                  <FaUserShield /> Admin Page
                </NavLink>
              </li>
            )}

            {!isLoading && isAdmin && (
              <li>
                <NavLink
                  to="/createadmin"
                  className="flex items-center gap-2 px-3 py-1.5 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition duration-200"
                >
                  <FaUserPlus />
                  <span>Create Admin</span>
                </NavLink>
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
                    onError={(e) => (e.target.src = ProfileImage)}
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
