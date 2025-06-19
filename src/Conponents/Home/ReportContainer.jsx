/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useCallback } from "react";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data";
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import { FaHourglassHalf } from "react-icons/fa";

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

function ReportContainer() {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [searchTerm, setSearchTerm] = useState("");
  const [countdowns, setCountdowns] = useState({});

  

useEffect(() => {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem("theme", theme);
}, [theme]);

const toggleTheme = () => {
  setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
};


  const { currentUser } = useUser();
  const isAdmin = currentUser?.role === "admin";

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
  }, [fetchBlogs]);

  const visibleBlogs = isAdmin
    ? data
    : data.filter((blog) => blog.isVerified === true);


    useEffect(() => {
  const interval = setInterval(() => {
    const updatedCountdowns = {};

    data.forEach((blog) => {
      if (blog?.date?.seconds) {
        const now = new Date();
        const blogDate = new Date(blog.date.seconds * 1000);
        const diff = blogDate - now;

        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          const seconds = Math.floor((diff / 1000) % 60);

          updatedCountdowns[blog.id] = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
      }
    });

    setCountdowns(updatedCountdowns);
  }, 1000);

  return () => clearInterval(interval);
}, [data]);


  return (
<div className="w-full px-6 pt-28 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen transition-colors duration-500">
    
    <div className="w-full flex justify-between items-center gap-4 flex-wrap mb-6 mt-[-20px]">
  <div className="flex-grow max-w-3xl mx-auto text-gray-600">
    <input
      type="text"
      placeholder="Search news or events..."
      className="w-full px-6 py-3 border border-gray-300 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition duration-200 color-gray-700"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <button
    onClick={toggleTheme}
    className="p-3 bg-indigo-100 dark:bg-gray-700 rounded-full shadow transition hover:scale-105"
    title="Toggle Theme"
  >
    {theme === "dark" ? (
      <SunIcon className="w-6 h-6 text-yellow-400" />
    ) : (
      <MoonIcon className="w-6 h-6 text-gray-800" />
    )}
  </button>
</div>


      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow p-4 space-y-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full rounded-xl"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
              <div className="flex items-center space-x-3 mt-4">
                <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleBlogs.length > 0 ? (
              visibleBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group bg-white dark:bg-gray-800 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 flex flex-col overflow-hidden border border-transparent hover:border-indigo-400 dark:hover:border-indigo-600"
                >
                  {blog.image ? (
                    <div className="relative overflow-hidden rounded-t-3xl">
                      <img
                        src={blog.image}
                        alt="Blog Cover"
                        className="w-full h-64 object-cover brightness-90 group-hover:brightness-110 transition duration-500"
                        loading="lazy"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex justify-between items-center">
                        <span className="text-white font-semibold text-sm tracking-wide">
                          {blog.date
                            ? new Date(
                                blog.date.seconds * 1000
                              ).toLocaleDateString()
                            : "No Date"}
                        </span>
                        <div className="flex items-center gap-2">
                          <img
                            src={blog.authorImg || prof}
                            alt="Author"
                            className="w-8 h-8 rounded-full border-2 border-white object-cover"
                            loading="lazy"
                          />
                          <span className="text-white text-sm font-medium truncate max-w-[100px]">
                            {blog.isAdmin ? "Admin" : blog.authorName || "User"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-30 bg-indigo-100 dark:bg-indigo-800 rounded-t-3xl text-indigo-600 dark:text-indigo-200 p-6 text-center">
                      <h2 className="text-2xl font-extrabold mb-2 tracking-tight h-40 text-gray-500 dark:text-gray-400">
                        DU Local News
                      </h2>
                      <p className="text-lg font-light mt-[-20px]">
                        Image isn't available for this news.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col flex-grow p-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1">
                      {truncate(blog.title, 40)}
                    </h3>
                    <p className="text-sm text-left text-gray-700 dark:text-gray-300 flex-grow mb-6 line-clamp-4">
                      {truncate(blog.desc || "", 150)}
                    </p>



<div className="flex items-center gap-2 font-semibold text-sm tracking-wide mt-[-20px] text-left text-gray-500 dark:text-gray-400 font-mono mb-4">
  {blog.date ? (() => {
    const now = new Date();
    const blogDate = new Date(blog.date.seconds * 1000);
    const isUpcoming = blogDate > now;

    if (isUpcoming) {
      return (
        <>
          <FaHourglassHalf className="animate-spin text-indigo-600 dark:text-indigo-400" />
          Upcoming - {countdowns[blog.id] || "tracking..."}
        </>
      );
    } else {
      <></>
    }
  })() : "Date not included"}
</div>



                    <Link
                      to={`/blog/${blog.id}`}
                      className="inline-block self-start px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transform transition duration-300"
                    >
                      Read More →
                    </Link>
                  </div>

                  <footer className="flex items-center justify-between px-6 py-4 bg-indigo-50 dark:bg-indigo-900 border-t border-indigo-100 dark:border-indigo-800 text-indigo-700 dark:text-indigo-200 font-medium text-sm">
                    <div className="flex space-x-6 select-none">
                      <div className="flex items-center gap-1">
                       <HandThumbUpIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />

                        <span>{blog.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                       <HandThumbDownIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />

                        <span>{blog.dislikes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                       <ChatBubbleLeftRightIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />

                        <span>{blog.comments?.length || 0}</span>
                      </div>
                    </div>
                    <Link to={`/profile/${blog.userId}`}>
                      <img
                        src={blog.authorImg || prof}
                        alt="User Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-indigo-600 dark:border-indigo-300 shadow-sm"
                        loading="lazy"
                      />
                    </Link>
                  </footer>
                </article>
              ))
            ) : (
              <p className="col-span-full text-center w-full text-indigo-400 dark:text-indigo-200 text-lg font-semibold mt-20">
                No News or Event found.
              </p>
            )}
          </div>

          {hasMore && !isLoading && (
            <div className="flex justify-center mt-10">
              <button
                onClick={fetchBlogs}
                className="px-6 py-2 text-white font-medium rounded-full bg-indigo-600 hover:bg-indigo-700 dark:hover:bg-indigo-500 transition"
                disabled={fetchingMore}
              >
                {fetchingMore ? "Loading..." : "Load More"}
              </button>
            </div>
            
          )}
        </>
        
      )}
      
    </div>
    
  );
}

export default ReportContainer;
