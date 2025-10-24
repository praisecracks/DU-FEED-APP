// Containers/Header/Header.jsx
import { Link, NavLink } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BsMenuButtonWide } from "react-icons/bs";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import ProfileImage from "../../Asset/admin.png";
import domi from "../../Asset/dominion_logo.png";
import { AiOutlineHome, AiOutlineInfoCircle } from "react-icons/ai";
import { MdCreate, MdOutlineArticle } from "react-icons/md";
import { FaUserShield, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const panelRef = useRef();

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

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
          }
        } catch (err) {
          console.error(err);
        }
      }
      setIsLoading(false);
    }
    fetchUserData();
  }, [currentUser]);

  const isLoggedIn = !!currentUser;

  // close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (!menuOpen) return;
      if (panelRef.current && !panelRef.current.contains(e.target)) setMenuOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 py-3 rounded-2xl backdrop-blur-md bg-white/6 dark:bg-black/30 border border-white/6 dark:border-gray-800 shadow-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <Link to="/home" className="flex items-center gap-2 select-none">
            <span className="text-2xl font-serif font-extrabold text-[#61593b]">DU</span>
            <span className="text-indigo-500 font-semibold">FEED</span>
            <img src={domi} alt="logo" className="w-8 h-8 object-contain" />
          </Link>
        </motion.div>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-800 dark:text-gray-200">
          <NavLink to="/home" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/6 dark:hover:bg-white/3 transition">
            <AiOutlineHome /> Dashboard
          </NavLink>
          <NavLink to="/about" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/6 dark:hover:bg-white/3 transition">
            <AiOutlineInfoCircle /> About
          </NavLink>

          {isLoggedIn && (
            <>
              <NavLink to="/create" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/6 transition">
                <MdCreate /> Create
              </NavLink>
              <NavLink to="/blogs" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/6 transition">
                <MdOutlineArticle /> My Blogs
              </NavLink>
            </>
          )}

          {!isLoading && (isAdmin || isSubAdmin) && (
            <NavLink to="/admin" className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/6 transition">
              <FaUserShield /> Admin
            </NavLink>
          )}

          {!isLoading && isAdmin && (
            <NavLink to="/createadmin" className="px-3 py-2 border border-indigo-600 text-indigo-600 rounded-full hover:bg-indigo-600 hover:text-white transition">
              <FaUserPlus />
            </NavLink>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block">
            <NavLink to={isLoggedIn ? "/profile" : "/login"} className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-4 py-2 rounded-full shadow">
              {isLoggedIn ? (
                <img src={currentUser?.photoURL || ProfileImage} alt="profile" className="w-8 h-8 rounded-full border-2 border-white object-cover" />
              ) : (
                <div className="flex items-center gap-2"><FaSignInAlt /> Login</div>
              )}
            </NavLink>
          </div>

          {/* Theme toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-full border border-white/8"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <SunIcon className="w-5 h-5 text-yellow-400" /> : <MoonIcon className="w-5 h-5 text-indigo-300" />}
          </motion.button>

          {/* Mobile menu */}
          <motion.button
            onClick={() => setMenuOpen((p) => !p)}
            className="lg:hidden p-2 text-2xl"
            aria-label="Open menu"
          >
            <BsMenuButtonWide />
          </motion.button>
        </div>
      </div>

      {/* mobile panel (slide from right) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              ref={panelRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed right-0 top-0 h-full w-72 z-50 bg-white/90 dark:bg-black/95 backdrop-blur-2xl shadow-2xl border-l border-white/6 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-semibold">DU Feed</span>
                </div>
                <button onClick={() => setMenuOpen(false)} className="text-xl p-1">✕</button>
              </div>

              <nav className="flex flex-col gap-2 mt-4">
                <NavLink onClick={() => setMenuOpen(false)} to="/home" className="px-3 py-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-800">Dashboard</NavLink>
                <NavLink onClick={() => setMenuOpen(false)} to="/about" className="px-3 py-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-800">About</NavLink>
                {isLoggedIn && (
                  <>
                    <NavLink onClick={() => setMenuOpen(false)} to="/create" className="px-3 py-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-800">Create</NavLink>
                    <NavLink onClick={() => setMenuOpen(false)} to="/blogs" className="px-3 py-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-800">My Blogs</NavLink>
                  </>
                )}
                {!isLoading && (isAdmin || isSubAdmin) && (
                  <NavLink onClick={() => setMenuOpen(false)} to="/admin" className="px-3 py-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-800">Admin</NavLink>
                )}
              </nav>

              <div className="mt-auto">
                <NavLink onClick={() => setMenuOpen(false)} to={isLoggedIn ? "/profile" : "/login"} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-full">
                  {isLoggedIn ? "Profile" : "Login"}
                </NavLink>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
