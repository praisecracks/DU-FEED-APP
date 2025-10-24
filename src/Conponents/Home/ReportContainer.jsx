/* Compact, responsive version */
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data";
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import {
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs,
} from "firebase/firestore";
import { useUser } from "../../Context/UserContext";

export default function ReportContainer() {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchTerm, setSearchTerm] = useState("");
  const [countdowns, setCountdowns] = useState({});
  const [showScroll, setShowScroll] = useState(false);

  const { currentUser } = useUser();
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  const fetchBlogs = useCallback(async () => {
    try {
      setFetchingMore(true);
      const postQuery = lastVisible
        ? query(
            collection(db, "Blogs"),
            orderBy("date", "desc"),
            startAfter(lastVisible),
            limit(6)
          )
        : query(collection(db, "Blogs"), orderBy("date", "desc"), limit(6));

      const snapshot = await getDocs(postQuery);
      if (snapshot.empty) {
        setHasMore(false);
        setFetchingMore(false);
        setIsLoading(false);
        return;
      }
      const newData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData((prev) => [...prev, ...newData]);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setFetchingMore(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setFetchingMore(false);
      setIsLoading(false);
    }
  }, [lastVisible]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      data.forEach((b) => {
        if (b?.date?.seconds) {
          const now = new Date();
          const d = new Date(b.date.seconds * 1000);
          const diff = d - now;
          if (diff > 0) {
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            updated[b.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
          }
        }
      });
      setCountdowns(updated);
    }, 1000);
    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    const onScroll = () => setShowScroll(window.scrollY > 360);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visibleBlogs = isAdmin ? data : data.filter((b) => b.isVerified === true);
  const q = searchTerm.trim().toLowerCase();
  const filtered = visibleBlogs.filter((b) => {
    if (!q) return true;
    const title = (b.title || "").toLowerCase();
    const desc = (b.desc || b.content || "").toLowerCase();
    const author = (b.authorName || b.author || "").toLowerCase();
    return title.includes(q) || desc.includes(q) || author.includes(q);
  });

  const cardVariant = {
    hidden: { opacity: 0, y: 12 },
    show: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05 },
    }),
  };

  return (
    <div className="w-full px-4 sm:px-6 pt-28 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-500">
      {/* Hero */}
      <section className="relative max-w-6xl mx-auto mb-8">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-10 -top-10 w-52 h-52 bg-gradient-to-tr from-indigo-400/30 via-purple-300/25 to-transparent blur-3xl animate-float opacity-60" />
          <div className="absolute -right-12 top-24 w-44 h-44 bg-gradient-to-br from-cyan-300/20 via-indigo-300/10 to-transparent blur-2xl animate-float opacity-60" />
        </div>

        <div className="bg-white/40 dark:bg-black/40 backdrop-blur-md rounded-2xl p-5 shadow-md border border-white/10">
          <h1 className="text-2xl md:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Stay Updated. Stay Connected.
          </h1>
          <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm md:text-base max-w-2xl">
            Dominion University Feed — campus news and events in realtime.
          </p>

          <div className="mt-4 flex gap-2 items-center flex-wrap">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type="text"
              placeholder="Search news or authors..."
              className="flex-1 px-4 py-2.5 rounded-full bg-white border border-gray-200 dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm"
            />
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-indigo-50 dark:bg-gray-700 border border-white/10 hover:scale-105 transition"
            >
              {theme === "dark" ? (
                <SunIcon className="w-4 h-4 text-yellow-400" />
              ) : (
                <MoonIcon className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden shadow-md h-52 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filtered.length > 0 ? (
                filtered.map((blog, idx) => {
                  const blogDate = blog?.date?.seconds
                    ? new Date(blog.date.seconds * 1000)
                    : null;
                  const now = new Date();
                  const isUpcoming = blogDate && blogDate > now;
                  const authorName =
                    blog.authorName || blog.author || blog.authorFullName || "User";

                  return (
                    <motion.article
                      key={blog.id}
                      variants={cardVariant}
                      initial="hidden"
                      animate="show"
                      custom={idx}
                      whileHover={{
                        translateY: -4,
                        boxShadow: "0 12px 30px rgba(99,102,241,0.12)",
                      }}
                      className="bg-white/70 dark:bg-gray-900/70 rounded-2xl shadow-md overflow-hidden flex flex-col"
                    >
                      {blog.image ? (
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-40 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-800 text-indigo-600 dark:text-indigo-200 font-semibold">
                          DU Local News
                        </div>
                      )}

                      <div className="p-3 flex flex-col flex-grow">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                          {truncate(blog.title || "Untitled", 70)}
                        </h3>
                        <p className="text-xs text-gray-700 dark:text-gray-300 flex-grow line-clamp-3">
                          {truncate(blog.desc || blog.content || "", 120)}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-300">
                            <img
                              src={blog.authorImg || prof}
                              alt={authorName}
                              className="w-7 h-7 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                            />
                            <div>
                              <span className="font-medium text-gray-800 dark:text-gray-100 block">
                                {authorName}
                              </span>
                              <span className="text-[10px] text-gray-500">
                                {blogDate
                                  ? isUpcoming
                                    ? `Upcoming • ${
                                        countdowns[blog.id] || "tracking..."
                                      }`
                                    : blogDate.toLocaleDateString()
                                  : "No date"}
                              </span>
                            </div>
                          </div>
                          <Link
                            to={`/blog/${blog.id}`}
                            className="text-xs px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow"
                          >
                            Read →
                          </Link>
                        </div>
                      </div>

                      <footer className="flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 text-xs font-medium">
                        <div className="flex items-center gap-3 select-none">
                          <div className="flex items-center gap-1">
                            <HandThumbUpIcon className="w-4 h-4" />
                            <span>{blog.likes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <HandThumbDownIcon className="w-4 h-4" />
                            <span>{blog.dislikes?.length || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ChatBubbleLeftRightIcon className="w-4 h-4" />
                            <span>{blog.comments?.length || 0}</span>
                          </div>
                        </div>

                        <Link to={`/profile/${blog.userId}`}>
                          <img
                            src={blog.authorImg || prof}
                            alt="author"
                            className="w-6 h-6 rounded-full border border-indigo-400 dark:border-indigo-200"
                          />
                        </Link>
                      </footer>
                    </motion.article>
                  );
                })
              ) : (
                <p className="col-span-full text-center text-indigo-400 dark:text-indigo-200 text-base font-semibold mt-16">
                  No News or Event found.
                </p>
              )}
            </AnimatePresence>
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                onClick={fetchBlogs}
                disabled={fetchingMore}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-600 text-white text-sm shadow hover:scale-105 transition"
              >
                {fetchingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}

      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed right-5 bottom-8 z-50 p-2.5 rounded-full bg-indigo-600 text-white shadow-lg hover:scale-105 transition"
        >
          ↑
        </button>
      )}
    </div>
  );
}
