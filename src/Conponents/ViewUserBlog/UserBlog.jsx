import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { IoSend } from "react-icons/io5";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  onSnapshot
} from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import Header from "../../Containers/Header/Header";
import likeIcon from "../../Asset/userLike.png";
import { FaTrash } from "react-icons/fa";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaReply } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { FaRemoveFormat } from "react-icons/fa";

function UserBlog() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [lastCommentTime, setLastCommentTime] = useState(0);
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
    if (!currentUser) return alert("Login to like this post");

    setLoading(true);
    try {
      const postRef = doc(db, "Blogs", id);
      if (data.likes?.includes(currentUser.uid)) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
    setLoading(false);
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
        if (userData.isAdmin || userData.isSubAdmin) return "Admin";
      }
      anonymousUsers.current[userId] = Math.floor(1000 + Math.random() * 9000);
      return `Anonymous ${anonymousUsers.current[userId]}`;
    } catch {
      return `Anonymous ${anonymousId}`;
    }
  };

  const handleSendMessage = async () => {
    if (!currentUser) return alert("Login to comment");

    const now = Date.now();
    if (now - lastCommentTime < 10000) {
      alert("Wait 10 seconds before posting again.");
      return;
    }

    const text = replyTo ? replyMessage.trim() : newMessage.trim();
    if (!text) return;

    if (
      !replyTo &&
      data?.comments?.filter((msg) => msg.senderId === currentUser.uid).length >= 5
    ) {
      return alert("You’ve reached the max of 5 comments.");
    }

    try {
      const userName = await fetchUserRole(currentUser.uid);
      const newEntry = {
        text,
        senderId: currentUser.uid,
        displayName: userName,
        timestamp: new Date()
      };

      const postRef = doc(db, "Blogs", id);

      if (replyTo) {
        const updatedComments = data.comments.map((comment) =>
          comment === replyTo
            ? {
                ...comment,
                replies: [...(comment.replies || []), newEntry]
              }
            : comment
        );
        await updateDoc(postRef, { comments: updatedComments });
        setReplyTo(null);
        setReplyMessage("");
      } else {
        await updateDoc(postRef, {
          comments: arrayUnion(newEntry)
        });
        setNewMessage("");
      }

      setLastCommentTime(now);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleDeleteComment = async (comment, parent) => {
    if (!currentUser) return alert("Login to delete comment");

    try {
      const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
      const isAdmin =
        userDoc.exists() &&
        (userDoc.data().isAdmin || userDoc.data().isSubAdmin);
      const isOwner = comment.senderId === currentUser.uid;
      const postRef = doc(db, "Blogs", id);

      if (isAdmin || isOwner) {
        if (parent) {
          const updated = data.comments.map((c) =>
            c === parent
              ? {
                  ...c,
                  replies: c.replies.filter((r) => r !== comment)
                }
              : c
          );
          await updateDoc(postRef, { comments: updated });
        } else {
          await updateDoc(postRef, {
            comments: arrayRemove(comment)
          });
        }
      } else {
        alert("You can only delete your own comment.");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const date = data?.date
    ? new Date(
        data.date.seconds * 1000 + data.date.nanoseconds / 1e6
      ).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-4 pt-20">
        {data ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            {data.image && (
              <img
                src={data.image}
                alt="Blog Post"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-gray-500 mb-2">{data.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{date}</p>
            <p className="text-gray-700 dark:text-gray-400 mb-6 text-left">
              {data.desc}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleLike}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  data.likes?.includes(currentUser?.uid)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } transition`}
              >
                {data.likes?.includes(currentUser?.uid) ? "Liked" : "Like"} (
                {data.likes?.length || 0})
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
  <div className="bg-black-600 dark:bg-gray-800 rounded-xl shadow-lg p-6 mt-6  ">
    <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Comments</h3>

<div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {data?.comments && data.comments.length > 0 ? (
        [...data.comments]
          .sort((a, b) =>
            new Date(b.timestamp?.toDate?.() || b.timestamp) - new Date(a.timestamp?.toDate?.() || a.timestamp)
          )
          .map((msg, index) => (
            <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-9 h-9 flex items-center justify-center bg-blue-400 text-white font-bold rounded-full">
                  {msg.displayName?.charAt(0)}
                </div>
                <div className="w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-blue-800 dark:text-blue-300">
                      {msg.displayName}
                    </span>
                    <small className="text-xs text-gray-500">
                      {msg.timestamp?.toDate
                        ? msg.timestamp.toDate().toLocaleString()
                        : new Date(msg.timestamp).toLocaleString()}
                    </small>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-gray-600 dark:text-gray-300 text-sm bg-transparent">
                <p className="text-left text-sm mt-1 whitespace-pre-wrap text-gray-800 dark:text-gray-200 bg-transparent">
                  {msg.text}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setReplyTo(msg)}
                    title="Reply"
                    className="hover:text-blue-600 text-blue-400 transition bg-transparent"
                  >
                    <FaReply />
                  </button>
                  <button
                    onClick={() => handleDeleteComment(msg)}
                    title="Delete"
                    className="hover:text-red-500 text-red-400 transition bg-transparent"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>


                </div>
              </div>

              {msg.replies?.length > 0 && (
                <div className="mt-3 pl-10 space-y-3 ">
                  {msg.replies.map((rep, i) => (
                    <div key={i} className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full  text-sm">
                          {rep.displayName?.charAt(0)}
                        </div>
                        <div className="w-full">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-blue-900 dark:text-blue-300">{rep.displayName}</span>
                            <small className="text-xs text-gray-500 tex-red">
                              {rep.timestamp?.toDate
                                ? rep.timestamp.toDate().toLocaleString()
                                : new Date(rep.timestamp).toLocaleString()}
                            </small>
                          </div>
                          <p className="text-sm mt-1 text-gray-700 dark:text-white whitespace-pre-wrap text-left">
                            {rep.text}
                          </p>
                          <div className="text-xs text-right mt-1">
                            <button
                              onClick={() => handleDeleteComment(rep, msg)}
                              title="Delete reply"
                              className="text-red-300 hover:text-red-400 bg-transparent transition "
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">Be the first to comment!</p>
      )}
    </div>

    {replyTo && (
      <div className="mt-6 mb-2 text-sm text-gray-700 dark:text-gray-300">
        Replying to <span className="font-semibold">{replyTo.displayName}...</span>
        <button onClick={() => setReplyTo(null)} className="ml-2 text-white text-xs bg-red-400">Cancel</button>
      </div>
    )}

    <textarea
      rows={3}
      resizable="none"
      maxLength={200}
      placeholder={replyTo ? "Type your reply... 😊" : "Type a comment... ✍️"}
      value={replyTo ? replyMessage : newMessage}
      onChange={(e) => replyTo ? setReplyMessage(e.target.value) : setNewMessage(e.target.value)}
      className="w-full h-24 p-3 mt-2 border rounded-md text-sm dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <button
      onClick={handleSendMessage}
      disabled={(!newMessage.trim() && !replyMessage.trim()) || loading}
      className={`mt-3 flex items-center gap-2 px-5 py-2 rounded-md text-white text-sm font-medium transition 
        ${loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"}`}
    >
      {loading ? "Sending..." : replyTo ? "Reply" : "Send"}
      <IoSend className="text-lg" />
    </button>
  </div>
)}


      </div>
    </div>
  );
}

export default UserBlog;
