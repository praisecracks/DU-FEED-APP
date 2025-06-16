import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import admin from "../../Asset/admin.png";
import { FaBackward } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import "./Admin.css";
import domi from "../../Asset/dominion_logo.png";


function Admin() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [data, setData] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [draggedPost, setDraggedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubAdmin, setIsSubAdmin] = useState(false);
  const [showType, setShowType] = useState("approved");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
const [openUserId, setOpenUserId] = useState(null);


  useEffect(() => {
    setIsLoading(true);
    const unsub = onSnapshot(collection(db, "Blogs"), async (querySnapshot) => {
      const postPromises = querySnapshot.docs.map(async (docItem) => {
        const postData = docItem.data();
        let userData = {};
        if (postData.uid) {
          try {
            const userDoc = await getDoc(doc(db, "Users", postData.uid));
            if (userDoc.exists()) {
              userData = userDoc.data();
            }
          } catch (err) {
            console.error("Error fetching user info:", err);
          }
        }
        return {
          ...postData,
          id: docItem.id,
          userName: userData.fullname || "Anonymous",
          userProfilePic: userData.image || admin,
          userId: postData.uid || null,
        };
      });

      

      const resolvedPosts = await Promise.all(postPromises);
      setData(resolvedPosts);
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
      const currentPost = data.find((post) => post.id === postId);
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

  const filteredPosts = data.filter((post) =>
    showType === "approved" ? post.isVerified : !post.isVerified
  );

  const pendingCount = useMemo(() => data.filter((post) => !post.isVerified).length, [data]);

useEffect(() => {
  const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
    const usersData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(usersData);
  });

  return () => unsubscribe();
}, []);


const promoteToAdmin = async (userId) => {
  try {
    await updateDoc(doc(db, "Users", userId), { role: "admin" });
    toast.success("User promoted to Admin.");
  } catch (error) {
    toast.error("Error promoting user to Admin.");
  }
};

const promoteToSubAdmin = async (userId) => {
  try {
    await updateDoc(doc(db, "Users", userId), { role: "subadmin" });
    toast.success("User promoted to Sub Admin.");
  } catch (error) {
    toast.error("Error promoting user to Sub Admin.");
  }
};

const disableUser = async (userId) => {
  try {
    await updateDoc(doc(db, "Users", userId), { disabled: true });
    toast.success("User disabled.");
  } catch (error) {
    toast.error("Error disabling user.");
  }
};



const enableUser = async (userId) => {
  try {
    await updateDoc(doc(db, "Users", userId), { disabled: false });
    toast.success("User enabled.");
  } catch (error) {
    toast.error("Error enabling user.");
  }
};



  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }} className="     w-full px-6 pt-28 pb-12 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 min-h-screen transition-colors duration-100
"  >
<div className="flex justify-center items-center h-full">
  <img src={domi} alt="" className="w-20 h-20" />
</div>
      <h1 className="max-w-screen bg-gray-50 dark:bg-gray-900 transition-colors"
 style={{ textAlign: "center", marginBottom: "20px" }}>Admin Dashboard</h1>

      <nav
        style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="flex items-center gap-4">

        <button
          onClick={() => navigate("/home")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#555",
            padding: "10px 20px",
            background: "#f5f5f5",
            border: "1px solid #ccc",
            cursor: "pointer",
            borderRadius: "5px",
          }}
          >
          <FaBackward /> Back
        </button>

          <button
          className="text-white bg-blue-700"
          onClick={() => setShowType("users")}
          >
          View all Users
          </button>
          </div>


        <div className="btns-posts" style={{ display: "flex", gap: "10px", position: "relative" }}>
          <button
            onClick={() => setShowType("approved")}
            style={{
              padding: "10px 15px",
              background: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Show Approved
          </button>

          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowType("pending")}
              style={{
                padding: "10px 15px",
                background: "#FF9800",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                position: "relative",
              }}
            >
              Show Pending
            </button>


            {pendingCount > 0 && (
              <span
                 style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      backgroundColor: "red",
                      color: "white",
                      fontSize: "10px",
                      minWidth: "18px",
                      fontWeight: "bold",
                      height: "18px",
                      borderRadius: "999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 4px",
                      border: "2px solid white",
                    }}
                    
              > {pendingCount}</span>
            )}

          </div>
        </div>
      </nav>


    {isLoading ? (
  <p style={{ textAlign: "center" }}>Wait, we are Loading admin panel...</p>
) : (
  <>
    {showType === "users" ? (
      <section>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
        <></>
       
        </div>
      </section>
    ) : (
      <section>
        <h2>
          {showType === "approved"
            ? "Approved Posts"
            
            : "Pending / Disapproved Posts"}
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
          
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
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
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      borderRadius: "5px",
                    }}
                    
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      borderRadius: "5px",
                      backgroundColor: "#f0f0f0",
                      color: "#888",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontStyle: "italic",
                    }}
                    className="max-w-screen bg-gray-50 dark:bg-gray-900 transition-colors"
                  >
                    This is a local news
                  </div>
                )}

                <h3 style={{ margin: "10px 0" }}>{post.title}</h3>

                {showType === "approved" ? (
                  <>
                    <button
                      style={{
                        marginBottom: "5px",
                        padding: "8px 12px",
                        background: "#2196F3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      className="max-w-screen bg-gray-50 dark:bg-gray-900 transition-colors"
                      onClick={() => setSelectedPost(post)}
                    >
                      View Content
                    </button>
                    <button
                      style={{
                        padding: "8px 12px",
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={() => handleApprove(post.id, "disapprove")}
                    >
                      Disapprove
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      style={{
                        padding: "8px 12px",
                        background: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => handleApprove(post.id, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      style={{
                        marginTop: "5px",
                        padding: "8px 12px",
                        background: "#2196F3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginLeft: "10px",
                      }}
                      onClick={() => setSelectedPost(post)}
                    >
                      View Content
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p style={{ gridColumn: "1 / -1", textAlign: "center" }}>
              No {showType} posts.
            </p>
          )}
        </div>
      </section>
    )}
  </>
)}


      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => handleDeletePost(draggedPost?.id)}
        className="recycle-bin"
      >
        <h3>Recycle Bin</h3>
        <p>Drag posts here to delete them.</p>
      </div>

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
    height: "80%",
    maxWidth: "600px",
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    textAlign: "center",
    overflowY: "scroll",
  }}

>
  <h2>Post Details</h2>

  {selectedPost.image && (
    <img
      src={selectedPost.image}
      alt={selectedPost.title}
      style={{
        width: "100%",
        height: "250px",
        objectFit: "cover",
        borderRadius: "8px",
        marginBottom: "20px",
      }}
           className="max-w-screen bg-gray-50 dark:bg-gray-900 transition-colors"

    />
  )}

  <h3>{selectedPost.title}</h3>
  <p>{selectedPost.desc}</p>

  <div
    style={{
      marginTop: "20px",
      display: "flex",
      justifyContent: "center",
      gap: "10px",
      flexWrap: "wrap",
    }}
  >
    <button
      style={{
        padding: "10px 15px",
        background: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={() => handleApprove(selectedPost.id, "approve")}
    >
      Approve
    </button>
    <button
      style={{
        padding: "10px 15px",
        background: "#f44336",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={() => handleApprove(selectedPost.id, "disapprove")}
    >
      Disapprove
    </button>
    <button
      style={{
        padding: "10px 15px",
        background: "#9e9e9e",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={() => setSelectedPost(null)}
    >
      Close
    </button>
  </div>
</div>

        </div>
      )}


{showType === "users" && (

  <section >
  <h2>Registered Users</h2>
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(270px, 2fr))",
      gap: "20px",
      marginTop: "20px",
      position: "relative",
    }}
    
    
    >
    {users.map((user) => (
      <div
      key={user.id}
      style={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        background: "#fff",
        textAlign: "center",
        display:"block",
        justifyContent: "center",
        alignItems: "center",
      }}
          className="max-w-screen bg-gray-50 dark:bg-gray-900 transition-colors"

      
      >
          <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        
          >
          <img
            src={user.authorImg || admin}
            alt={user.name}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              objectFit: "cover",
              background: "#f0f0f0",
            }}
            />
        </div>

    <h4>{user.name || "Unnamed"}</h4>
    <p style={{fontSize: "14px", flexWrap: "wrap", textAlign: "center"}}>{user.email}</p>
    <p style={{ fontSize: "12px", color: "#555", textAlign: "center" }}>Role: {user.role || "student"}</p>
    <p style={{ fontSize: "12px", textAlign: "center", color: user.disabled ? "red" : "green" }}>
      Status: {user.disabled ? "Disabled" : "Active"}
    </p>

        <button
          onClick={() =>
            setOpenUserId((prev) => (prev === user.id ? null : user.id))
          }
          style={{
            marginTop: "10px",
            padding: "6px 10px",
            backgroundColor: "#70653d",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            width: "70%"
          }}
          >
          {openUserId === user.id ? "Close" : "Manage"}
        </button>

        {openUserId === user.id && (
          <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "6px" }}>
           <button
          onClick={() => {
            if (window.confirm("Are you sure you want to promote this user to admin?")) {
              promoteToAdmin(user.id);
            }
          }}
          style={{
            backgroundColor: "#4CAF50",
            color: "#fff",
            padding: "5px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          >
          Promote to Admin
        </button>

                          <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to promote this user to sub admin?")) {
                    promoteToSubAdmin(user.id);
                  }
                }}
                style={{
                  backgroundColor: "#2196F3",
                  color: "#fff",
                  padding: "5px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                >
                Promote to Sub Admin
              </button>

            {user.disabled ? (
              <button
              onClick={() => enableUser(user.id)}
              style={{
                backgroundColor: "#FFC107",
                color: "#fff",
                padding: "5px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              >
                Enable User
              </button>
            ) : (
              <button
              onClick={() => disableUser(user.id)}
              style={{
                backgroundColor: "#FF9800",
                color: "#fff",
                padding: "5px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              >
                Disable User
              </button>
            )}
            <button
              onClick={async () => {
                if (window.confirm("Are you sure you want to delete this user?")) {
                  try {
                    await deleteDoc(doc(db, "Users", user.id));
                    toast.success("User deleted successfully.");
                  } catch (error) {
                    toast.error("Error deleting user.");
                  }
                }
              }}
              style={{
                backgroundColor: "#f44336",
                color: "#fff",
                padding: "5px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              >
              Delete User
            </button>
          </div>
        )}
      </div>
    ))}
  </div>
</section>

)} 





    </div>
  );
}

export default Admin;


