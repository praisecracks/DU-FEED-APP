/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState, useCallback } from "react";
import prof from "../../Asset/profileFilled.svg";
import { truncate } from "../../Context/data";
import { Link } from "react-router-dom";
import { db } from "../../Context/Firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  getDocs
} from "firebase/firestore";
import { useUser } from "../../Context/UserContext"; // Correct hook

function ReportContainer() {
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);

  const { currentUser } = useUser(); // Corrected hook usage
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
        id: doc.id
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

  return (
    <div className="w-full px-6 py-12 mt-10 bg-gradient-to-br from-gray-50 via-white to-gray-100 min-h-screen">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh] text-gray-500 text-xl font-semibold tracking-wide animate-pulse">
          Loading FEEDS...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleBlogs.length > 0 ? (
              visibleBlogs.map((blog) => (
                <article
                  key={blog.id}
                  className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition duration-500 flex flex-col overflow-hidden border border-transparent hover:border-indigo-400"
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
                    <div className="flex flex-col items-center justify-center h-30 bg-indigo-100 rounded-t-3xl text-indigo-600 p-6 text-center">
                      <h2 className="text-2xl font-extrabold mb-2 tracking-tight h-40">
                        DU Local News
                      </h2>
                      <p className="text-lg font-light mt-[-20px] p-[-20]">
                        Image isn't available for this news.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col flex-grow p-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-1">
                      {truncate(blog.title, 40)}
                    </h3>
                    <p className="text-sm text-left text-gray-700 flex-grow mb-6 line-clamp-4">
                      {truncate(blog.desc || "", 150)}
                    </p>
                    <Link
                      to={`/blog/${blog.id}`}
                      className="inline-block self-start px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-indigo-500/40 hover:scale-105 transform transition duration-300"
                    >
                      Read More →
                    </Link>
                  </div>

                  <footer className="flex items-center justify-between px-6 py-4 bg-indigo-50 border-t border-indigo-100 text-indigo-700 font-medium text-sm">
                    <div className="flex space-x-6 select-none">
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M2 10a6 6 0 1111.452 4.391l3.527 2.208a.75.75 0 01-1.118.98l-3.92-3.13a6.004 6.004 0 01-9.941-4.449z" />
                        </svg>
                        <span>{blog.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 14L2 22M14 10l6-6M5 21l3-3"
                          />
                        </svg>
                        <span>{blog.dislikes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-4l-4 4v-4H7a2 2 0 01-2-2v-2" />
                        </svg>
                        <span>{blog.comments?.length || 0}</span>
                      </div>
                    </div>
                    <Link to={`/profile/${blog.userId}`}>
                      <img
                        src={blog.authorImg || prof}
                        alt="User Profile"
                        className="w-9 h-9 rounded-full object-cover border-2 border-indigo-600 shadow-sm"
                        loading="lazy"
                      />
                    </Link>
                  </footer>
                </article>
              ))
            ) : (
              <p className="col-span-full text-center w-full text-indigo-400 text-lg font-semibold mt-20">
                No News or Event found.
              </p>
            )}
          </div>

          {hasMore && !isLoading && (
            <div className="flex justify-center mt-10">
              <button
                onClick={fetchBlogs}
                className="px-6 py-2 text-white font-medium rounded-full bg-indigo-600 hover:bg-indigo-700 transition"
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
