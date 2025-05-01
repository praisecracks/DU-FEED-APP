import { useState, useEffect } from "react";
import "./MyBlogs.css";
import srch from '../../Asset/search.svg';
import edit from '../../Asset/editWhite.png';
import del from '../../Asset/delete.svg';
import like from '../../Asset/userLike.png';
import { Link, useNavigate } from "react-router-dom";
import Footer from "../../Containers/Footer/Footer";
import { collection, onSnapshot, query, Timestamp } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import useDeletePost from "../../Hooks/UseDeleteHook";
import { useUser } from "../../Context/UserContext";

function MyBlogs() {
  const [isLoading, setIsLoading] = useState(false);
  const [Data, setData] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const { deletePost } = useDeletePost();
  const { currentUser } = useUser();
  const Auth_id = currentUser.uid;
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

  // Filtered Blogs Logic
  const filteredBlogs = SingleBlogs?.filter((blog) => {
    const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = blog.desc?.toLowerCase().includes(searchTerm.toLowerCase());
    const dateMatch = blog.date instanceof Timestamp &&
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

  return (
    <div className="MyBlogs">
      <div className="head">
        <nav>
          <ul>
            <li>
              <Link to="/home">Home</Link>
            </li>
          </ul>
        </nav>
        <div className="div">
          <h5>My Publications</h5>
        </div>

        <div className="srch">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && e.preventDefault()}
          />
        </div>
      </div>

      <div className="mid">
        <div className="blogs-list">
          {filteredBlogs && filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="blog-card">
                {blog.image && <div className="image-connect"><img src={blog.image} alt="" /></div>}
                <h2>{blog.title}</h2>
                <p>{blog.date instanceof Timestamp ? blog.date.toDate().toLocaleString() : "No Date Available"}</p>
                <p className="blog-text">{blog.desc}</p>

                <div className="actions">
                  <button onClick={() => navigate(`/edit/${blog.id}`)}>Edit <img src={edit} alt="" /></button>
                  <button onClick={() => handleDelete(blog.id)}>Delete <img src={del} alt="" /></button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-blogs">{isLoading ? "Loading...." : "No blogs found."}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default MyBlogs;
