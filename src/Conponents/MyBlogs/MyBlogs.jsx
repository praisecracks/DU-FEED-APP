import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import useDeletePost from "../../Hooks/UseDeleteHook";
import Footer from "../../Containers/Footer/Footer";
import srch from "../../Asset/search.svg";
import edit from "../../Asset/editWhite.png";
import del from "../../Asset/delete.svg";

export default function MyBlogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null); // For modal
  const { deletePost } = useDeletePost();
  const { currentUser } = useUser();
  const Auth_id = currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "Blogs"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const StreamArray = [];
      querySnapshot.forEach((doc) => StreamArray.push({ ...doc.data(), id: doc.id }));
      setData(StreamArray);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  const SingleBlogs = Data?.filter((e) => e.authId === Auth_id);

  const filteredBlogs = SingleBlogs?.filter((blog) => {
    const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = blog.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch =
      blog.date instanceof Timestamp &&
      blog.date.toDate().toLocaleString().toLowerCase().includes(searchTerm.toLowerCase());
    return searchTerm === "" || titleMatch || descMatch || dateMatch;
  });

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;
    const result = await deletePost(postId);
    if (result.success) alert("Post deleted successfully!");
  };

  const toggleReadMore = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-200 transition-colors duration-500">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/home" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
          ← Back to Dashboard
        </Link>
        <h1 className="text-lg sm:text-xl font-bold tracking-wide text-gray-700 dark:text-gray-300">
          My Publications
        </h1>
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <img src={srch} alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-70" />
        </div>
      </header>

      {/* Blog List */}
      <main className="flex-grow px-4 sm:px-6 md:px-10 py-10">
        {isLoading ? (
          <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
        ) : filteredBlogs?.length > 0 ? (
          <div className={`grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-all duration-500 ${selectedBlog ? "filter blur-sm brightness-75 pointer-events-none" : ""}`}>
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="relative rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-800/90 cursor-pointer group"
                onClick={() => setSelectedBlog(blog)} // Open modal
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt="blog"
                    className="w-full h-48 object-cover rounded-t-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="p-5 flex flex-col justify-between h-full relative">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{blog.title}</h2>
                  <p className="text-xs text-gray-500 mb-2">
                    {blog.date instanceof Timestamp ? blog.date.toDate().toLocaleString() : "No Date Available"}
                  </p>
                  <p className={`text-sm text-gray-700 dark:text-gray-400 mb-2 ${expanded[blog.id] ? "" : "line-clamp-3"}`}>
                    {blog.desc}
                  </p>
                  <span
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal open
                      toggleReadMore(blog.id);
                    }}
                    className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:underline"
                  >
                    {expanded[blog.id] ? "Read less" : "Read more"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-12">No blogs found.</p>
        )}
      </main>

      {/* Blog Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full mx-4 p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setSelectedBlog(null)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-200 font-bold text-xl hover:text-red-500 transition"
            >
              &times;
            </button>
            {selectedBlog.image && (
              <img src={selectedBlog.image} alt="blog" className="w-full h-64 object-cover rounded-md mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">{selectedBlog.title}</h2>
            <p className="text-xs text-gray-500 mb-4">
              {selectedBlog.date instanceof Timestamp ? selectedBlog.date.toDate().toLocaleString() : "No Date Available"}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">{selectedBlog.desc}</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => navigate(`/edit/${selectedBlog.id}`)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all"
              >
                <img src={edit} alt="Edit" className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  handleDelete(selectedBlog.id);
                  setSelectedBlog(null);
                }}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full transition-all"
              >
                <img src={del} alt="Delete" className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
