import { useState, useEffect } from "react";
import { db } from "../../Context/Firebase";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function RecentBlogsWidget() {
  const [blogs, setBlogs] = useState([]);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "Blogs"), orderBy("date", "desc"), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setBlogs(items);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className={`fixed top-1/4 right-0 bg-white dark:bg-gray-800 shadow-lg rounded-l-lg overflow-hidden transition-all ${collapsed ? "w-10" : "w-64"}`}>
      <div className="flex justify-between items-center p-2 cursor-pointer bg-gray-200 dark:bg-gray-700" onClick={() => setCollapsed(!collapsed)}>
        <span className="font-bold text-gray-700 dark:text-gray-200">{collapsed ? "→" : "Recent Blogs"}</span>
      </div>
      {!collapsed && (
        <div className="p-3 flex flex-col gap-2">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/user-blog/${blog.id}`}
                className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                title={blog.title}
              >
                {blog.title}
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No recent blogs</p>
          )}
        </div>
      )}
    </div>
  );
}
