import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import Header from "../../Containers/Header/Header";
import likeIcon from "../../Asset/userLike.png";
import { FaTrash } from "react-icons/fa";  // ✅ added icon import

function UserBlog() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const anonymousUsers = useRef({});
  const [anonymousId] = useState(() => {
    let storedId = localStorage.getItem("anonymousId");
    if (!storedId) {
      storedId = Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem("anonymousId", storedId);
    }
    return storedId;
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "Blogs", id), (docSnap) => {
      if (docSnap.exists()) {
        setData({ id: docSnap.id, ...docSnap.data() });
      } else {
        setData(null);
      }
    });
    return () => unsub();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser) {
      alert("Login to like this post");
      return;
    }
    setLoading(true);
    try {
      const postRef = doc(db, "Blogs", id);
      if (data.likes?.includes(currentUser.uid)) {
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      }
    } catch (error) {
      console.error("Error updating like: ", error);
    }
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      alert("Login to comment");
      return;
    }
    if (data?.comments?.filter(msg => msg.senderId === currentUser.uid).length >= 5) {
      alert("You have reached the maximum comment limit (5) for this post.");
      return;
    }
    if (newMessage.trim()) {
      try {
        const postRef = doc(db, "Blogs", id);
        const userName = await fetchUserRole(currentUser.uid);
        const newComment = {
          text: newMessage,
          senderId: currentUser.uid,
          displayName: userName,
          timestamp: new Date(),
        };
        await updateDoc(postRef, {
          comments: arrayUnion(newComment),
        });
        setNewMessage("");
      } catch (error) {
        console.error("Error posting comment: ", error);
      }
    }
  };

  const fetchUserRole = async (userId) => {
    if (!userId) return `Anonymous ${anonymousId}`;

    if (anonymousUsers.current[userId]) {
      return `Anonymous ${anonymousUsers.current[userId]}`;
    }

    try {
      const userDoc = await getDoc(doc(db, "Users", userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.isAdmin || userData.isSubAdmin) {
          return "Admin";
        }
      }
      anonymousUsers.current[userId] = Math.floor(1000 + Math.random() * 9000);
      return `Anonymous ${anonymousUsers.current[userId]}`;
    } catch (error) {
      console.error("Error fetching user role: ", error);
      return `Anonymous ${anonymousId}`;
    }
  };

  const handleDeleteComment = async (comment) => {
    if (!currentUser) {
      alert("Login to delete comment");
      return;
    }
    try {
      const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
      const isAdmin = userDoc.exists() && (userDoc.data().isAdmin || userDoc.data().isSubAdmin);
      const isOwner = comment.senderId === currentUser.uid;

      if (isAdmin || isOwner) {
        const postRef = doc(db, "Blogs", id);
        await updateDoc(postRef, {
          comments: arrayRemove(comment),
        });
        alert("Comment deleted successfully.");
      } else {
        alert("You can only delete your own comment.");
      }
    } catch (error) {
      console.error("Error deleting comment: ", error);
    }
  };

  const date = data?.date ? new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1e6) : null;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-4xl mx-auto p-4 mt-20">
        {data ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {data.image && (
              <img src={data.image} alt="Blog Post" className="w-full h-64 object-cover rounded-lg mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
            <p  className="text-sm text-gray-500 mb-4 text-left">{date?.toLocaleString()}</p>
            <p className="text-gray-700 mb-6 text-left">{data.desc}</p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${data.likes?.includes(currentUser?.uid) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} transition`}
              >
                {data.likes?.includes(currentUser?.uid) ? "Liked" : "Like"} ({data.likes?.length || 0})
                <img src={likeIcon} alt="like" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg transition"
              >
                {showChat ? "Close Comments" : "Open Comments"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading post...</p>
        )}

        {showChat && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Comments</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto mb-4">
              {data?.comments && data.comments.length > 0 ? (
                data.comments.map((msg, index) => (
                  <div key={index} className=" p-3 rounded-md relative text-left">
                    <div className="font-semibold">{msg.displayName}</div>
                    <p className="text-gray-600 text-left">{msg.text}</p>
                    <small className="text-gray-400">
                      {msg.timestamp?.toDate ? msg.timestamp.toDate().toLocaleString() : new Date(msg.timestamp).toLocaleString()}
                    </small>
                   <button
                        onClick={() => handleDeleteComment(msg)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-transparent"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>

                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Be the first to comment!</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <textarea
                maxLength={100}
                placeholder="Type a comment..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="w-full border rounded-md p-2 resize-none"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBlog;
