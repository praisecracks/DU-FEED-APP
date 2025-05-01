import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { collection, doc, onSnapshot, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import admin from "../../Asset/admin.png";
import { FaBackward } from "react-icons/fa";

function Admin() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [Data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [draggedPost, setDraggedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, "Blogs"), (querySnapshot) => {
      const StreamArray = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(StreamArray);
      setIsLoading(false);
    });

    return () => unsub();
  }, []);

  const fetchUserRole = useCallback(async () => {
    if (!currentUser) {
      setIsRoleLoading(false);
      return;
    }
    try {
      const userRef = doc(db, "Users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setIsAdmin(userData.role === "admin");
        setIsSubAdmin(userData.role === "subadmin");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setIsRoleLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  const handleApprove = async (postId, action) => {
    try {
      const postRef = doc(db, "Blogs", postId);
      const currentPost = Data.find((post) => post.id === postId);
      if (!currentPost) return toast.error("Post not found!");

      await updateDoc(postRef, { isVerified: action === "approve" });
      toast.success(`Post ${action === "approve" ? "Approved" : "Disapproved"}.`);
    } catch (error) {
      toast.error("Error updating post status.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "Blogs", postId));
        toast.success("Post deleted successfully.");
      } catch (error) {
        toast.error("Error deleting post.");
      }
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h1>

      {/* Navigation */}
      <nav style={{ marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button
          onClick={() => navigate("/home")}
          style={{ padding: "10px 20px", background: "#f5f5f5", border: "1px solid #ccc", cursor: "pointer", borderRadius: "5px" }}
        >
          <FaBackward style={{ marginRight: "8px" }} /> Back
        </button>

        {!isRoleLoading && isAdmin && (
          <button
            onClick={() => navigate("/createadmin")}
            style={{ padding: "10px 20px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            <img src={admin} alt="Admin" style={{ width: "20px", height: "20px", marginRight: "8px" }} />
            Create Sub Admin
          </button>
        )}
      </nav>

      {/* Loading */}
      {isLoading ? (
        <p style={{ textAlign: "center" }}>Loading...</p>
      ) : (
        <>
          {/* Approved Posts */}
          <section style={{ marginBottom: "50px" }}>
            <h2>Approved Posts</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {Data.filter((post) => post.isVerified).length > 0 ? (
                Data.filter((post) => post.isVerified).map((post) => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => setDraggedPost(post)}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                      background: "#fff",
                    }}
                  >
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
                    <h3 style={{ margin: "10px 0" }}>{post.title}</h3>
                    <button
                      style={{ marginBottom: "5px", padding: "8px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => setSelectedPost(post)}
                    >
                      View Content
                    </button>
                    <button
                      style={{ padding: "8px 12px", background: "#f44336", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => handleApprove(post.id, "disapprove")}
                    >
                      Disapprove
                    </button>
                  </div>
                ))
              ) : (
                <p>No approved posts yet.</p>
              )}
            </div>
          </section>

          {/* Pending / Disapproved Posts */}
          <section>
            <h2>Pending / Disapproved Posts</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px", marginTop: "20px" }}>
              {Data.filter((post) => !post.isVerified).length > 0 ? (
                Data.filter((post) => !post.isVerified).map((post) => (
                  <div
                    key={post.id}
                    draggable
                    onDragStart={() => setDraggedPost(post)}
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      padding: "10px",
                      textAlign: "center",
                      background: "#f9f9f9",
                    }}
                  >
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "5px" }} />
                    <h3 style={{ margin: "10px 0" }}>{post.title}</h3>
                    <button
                      style={{ marginBottom: "5px", padding: "8px 12px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => handleApprove(post.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      style={{ padding: "8px 12px", background: "#2196F3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}
                      onClick={() => setSelectedPost(post)}
                    >
                      View Content
                    </button>
                  </div>
                ))
              ) : (
                <p>No disapproved posts.</p>
              )}
            </div>
          </section>
        </>
      )}

      {/* Recycle Bin */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDeletePost(draggedPost?.id)}
        style={{
          marginTop: "50px",
          padding: "20px",
          background: "#ffebee",
          border: "2px dashed #f44336",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <h3>Recycle Bin</h3>
        <p>Drag posts here to delete them.</p>
      </div>

      {/* Post Details Popup */}
      {selectedPost && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "999",
          }}
        >
          <div
            style={{
              width: "90%",
              maxWidth: "600px",
              background: "#fff",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
            }}
          >
            <h2>Post Details</h2>
            <img src={selectedPost.image} alt={selectedPost.title} style={{ width: "100%", height: "250px", objectFit: "cover", borderRadius: "8px", marginBottom: "20px" }} />
            <h3>{selectedPost.title}</h3>
            <p>{selectedPost.desc}</p>
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <button
                style={{ padding: "10px 15px", background: "#4CAF50", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => handleApprove(selectedPost.id, "approve")}
              >
                Approve
              </button>
              <button
                style={{ padding: "10px 15px", background: "#f44336", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => handleApprove(selectedPost.id, "disapprove")}
              >
                Disapprove
              </button>
              <button
                style={{ padding: "10px 15px", background: "#9E9E9E", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}
                onClick={() => setSelectedPost(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
