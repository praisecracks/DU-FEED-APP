import { Link, NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useEffect, useState } from "react";
import { BsMenuButtonWide } from "react-icons/bs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import ProfileImage from "../../Asset/white profile.png";
import admin from "../../Asset/admin.png";
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
console.log(currentUser)
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const isLoggedIn = !!currentUser;

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center text-2xl font-bold text-black space-x-1">
          <span className="font-fantasy tracking-widest text-3xl">DU</span>
          <span className="text-primary">FEED</span>
        </Link>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu} 
          className="lg:hidden text-2xl text-primary focus:outline-none"
        >
          <BsMenuButtonWide />
        </button>

        {/* Nav Links */}
        <nav className={`absolute lg:relative top-full left-0 w-full lg:w-auto bg-white lg:bg-transparent transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden lg:max-h-full'}`}>
          <ul className="flex text-black flex-col lg:flex-row items-center gap-4 p-4 lg:p-0">
            <li>
              <NavLink to="/home" className="flex items-center gap-2 ">
                <AiOutlineHome /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className="flex items-center gap-2 hover:text-primary">
                <AiOutlineInfoCircle /> About
              </NavLink>
            </li>

            {isLoggedIn && (
              <>
                <li>
                  <NavLink to="/create" className="flex items-center gap-2 hover:text-primary">
                    <MdCreate /> Create
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/blogs" className="flex items-center gap-2 hover:text-primary">
                    <MdOutlineArticle /> My Blogs
                  </NavLink>
                </li>
              </>
            )}

            {!isLoading && (isAdmin || isSubAdmin) && (
              <li>
                <NavLink to="/admin" className="flex items-center gap-2 hover:text-primary">
                  <FaUserShield /> Admin Page
                </NavLink>
              </li>
            )}

            {!isLoading && isAdmin && (
              <li>
                <button
                  onClick={() => navigate("/createadmin")}
                  className="flex items-center gap-2 text-primary border-2 border-primary px-3 py-1 rounded-lg hover:bg-primary hover:text-white transition-all"
                >
                  <FaUserPlus /> 
                  <img src={admin} alt="Admin Icon" className="w-6 h-6" />
                </button>
              </li>
            )}

            {/* Login/Profile */}
            <li>
              <NavLink
                to={isLoggedIn ? "/profile" : "/login"}
                className="flex items-center gap-2 bg-gradient-to-r from-[#4c00a8] to-[#0056d9] text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-300"
                >
                {isLoggedIn ? (
                  <div className="flex items-center space-x-2 bdrr-50 justify-center-center display-flex">
                    <img
                      src={currentUser?.photoURL || ProfileImage}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover br-100"
                    />
                  </div>
                ) : (
                  <>
                    <FaSignInAlt />
                    Login
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
