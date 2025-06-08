import { useState, useEffect } from "react";
import srch from "../../Asset/search.svg";
import edit from "../../Asset/editWhite.png";
import del from "../../Asset/delete.svg";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Containers/Footer/Footer";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import useDeletePost from "../../Hooks/UseDeleteHook";
import { useUser } from "../../Context/UserContext";

function MyBlogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({});
  const { deletePost } = useDeletePost();
  const { currentUser } = useUser();
  const Auth_id = currentUser?.uid;
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "Blogs"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      const StreamArray = [];
      querySnapshot.forEach((doc) => {
        StreamArray.push({ ...doc.data(), id: doc.id });
      });
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
    if (result.success) {
      alert("Post deleted successfully!");
    }
  };

  const toggleReadMore = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100 text-gray-800">
      {/* Header */}
      <header className="w-full px-6 py-4 bg-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <nav className="text-blue-600 font-semibold hover:underline">
          <Link to="/home">← Back to Home</Link>
        </nav>
        <h1 className="text-2xl font-bold text-center">My Publications</h1>
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <img src={srch} alt="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
        </div>
      </header>

      {/* Blog List */}
      <main className="flex-grow px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden flex flex-col justify-between"
              >
                {blog.image && (
                  <img src={blog.image} alt="blog" className="w-full h-48 object-cover" />
                )}

                <div className="p-4 flex flex-col justify-between h-full">
                  <div>
                    <h2 className="text-lg font-semibold mb-1">{blog.title}</h2>
                    <p style={{textAlign:"left"}}className="text-sm text-gray-500 mb-2">
                      {blog.date instanceof Timestamp
                        ? blog.date.toDate().toLocaleString()
                        : "No Date Available"}
                    </p>
                    <p style={{textAlign:"left"}} className={`text-sm text-gray-700 mb-2 ${expanded[blog.id] ? "" : "line-clamp-4"}`}>
                      {blog.desc}
                    </p>
                    <span
                    style={{textAlign:"left"}}
                      onClick={() => toggleReadMore(blog.id)}
                      className="text-sm text-blue-900 cursor-pointer"
                    >
                      {expanded[blog.id] ? "Read less" : "Read more"}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      onClick={() => navigate(`/edit/${blog.id}`)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    >
                      <img src={edit} alt="Edit" className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      <img src={del} alt="Delete" className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full mt-8">
              {isLoading ? "Loading..." : "No blogs found."}
            </p>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default MyBlogs;
