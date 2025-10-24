import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import { IoSend } from "react-icons/io5";
import { FaTrash, FaReply, FaImage, FaSmile } from "react-icons/fa";
import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc } from "firebase/firestore";
import { db, storage } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import Header from "../../Containers/Header/Header";
import likeIcon from "../../Asset/userLike.png";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Picker from "emoji-picker-react";
import RecentBlogsWidget from "../MyBlogs/RecentBlogsWidget";

export default function UserBlog() {
  const { id } = useParams();
  const { currentUser } = useUser();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [lastCommentTime, setLastCommentTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(null);
  const anonymousUsers = useRef({});
  const [anonymousId] = useState(() => {
    let storedId = localStorage.getItem("anonymousId");
    if (!storedId) {
      storedId = Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem("anonymousId", storedId);
    }
    return storedId;
  });

  // Load blog post real-time
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
        await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
      } else {
        await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
    setLoading(false);
  };

  const fetchUserRole = async (userId) => {
    if (!userId) return `Anonymous ${anonymousId}`;
    if (anonymousUsers.current[userId]) return `Anonymous ${anonymousUsers.current[userId]}`;
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
    if (now - lastCommentTime < 10000) return alert("Wait 10 seconds before posting again.");
    const text = replyTo ? replyMessage.trim() : newMessage.trim();
    if (!text && !uploadingImage) return;

    if (!replyTo && data?.comments?.filter((msg) => msg.senderId === currentUser.uid).length >= 5)
      return alert("You’ve reached the max of 5 comments.");

    try {
      const userName = await fetchUserRole(currentUser.uid);

      const newEntry = {
        text,
        senderId: currentUser.uid,
        displayName: userName,
        timestamp: new Date(),
        image: uploadingImage || null,
      };

      const postRef = doc(db, "Blogs", id);

      if (replyTo) {
        const updatedComments = data.comments.map((comment) =>
          comment === replyTo ? { ...comment, replies: [...(comment.replies || []), newEntry] } : comment
        );
        await updateDoc(postRef, { comments: updatedComments });
        setReplyTo(null);
        setReplyMessage("");
      } else {
        await updateDoc(postRef, { comments: arrayUnion(newEntry) });
        setNewMessage("");
      }

      setUploadingImage(null);
      setLastCommentTime(now);
      setShowEmojiPicker(false);
    } catch (err) {
      console.error("Comment error:", err);
    }
  };

  const handleDeleteComment = async (comment, parent) => {
    if (!currentUser) return alert("Login to delete comment");
    try {
      const userDoc = await getDoc(doc(db, "Users", currentUser.uid));
      const isAdmin = userDoc.exists() && (userDoc.data().isAdmin || userDoc.data().isSubAdmin);
      const isOwner = comment.senderId === currentUser.uid;
      const postRef = doc(db, "Blogs", id);

      if (isAdmin || isOwner) {
        if (parent) {
          const updated = data.comments.map((c) =>
            c === parent ? { ...c, replies: c.replies.filter((r) => r !== comment) } : c
          );
          await updateDoc(postRef, { comments: updated });
        } else {
          await updateDoc(postRef, { comments: arrayRemove(comment) });
        }
      } else {
        alert("You can only delete your own comment.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEmojiClick = (emoji) => {
    if (replyTo) setReplyMessage((prev) => prev + emoji.emoji);
    else setNewMessage((prev) => prev + emoji.emoji);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage("Uploading...");
    const storageRef = ref(storage, `comments/${currentUser.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      () => {},
      (err) => console.error(err),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadingImage(url);
      }
    );
  };

  const date = data?.date
    ? new Date(data.date.seconds * 1000 + data.date.nanoseconds / 1e6).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header />
      <div className="max-w-4xl mx-auto p-4 pt-20 relative flex gap-6">
        {/* Blog Content */}
        {data ? (
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            {data.image && (
              <img
                src={data.image}
                alt="Blog Post"
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
            )}
            <h2 className="text-2xl font-bold text-gray-500 mb-2">{data.title}</h2>
            <p className="text-sm text-gray-500 mb-4">{date}</p>
            <p className="text-gray-700 dark:text-gray-400 mb-6 text-left">{data.desc}</p>
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
                {data.likes?.includes(currentUser?.uid) ? "Liked" : "Like"} ({data.likes?.length || 0})
                <img src={likeIcon} alt="like" className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSidebar((prev) => !prev)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg transition"
              >
                {showSidebar ? "Close Comments" : "Open Comments"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center">Loading post...</p>
        )}

        {/* Sidebar */}
        {showSidebar && (
          <div className="w-96 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg p-4 flex flex-col max-h-[80vh] overflow-y-auto custom-scrollbar transition">
            <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Comments</h3>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {data?.comments?.length > 0 ? (
                [...data.comments]
                  .sort((a, b) => new Date(b.timestamp?.toDate?.() || b.timestamp) - new Date(a.timestamp?.toDate?.() || a.timestamp))
                  .map((msg, idx) => (
                    <div key={idx} className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 flex items-center justify-center bg-blue-400 text-white font-bold rounded-full">
                          {msg.displayName?.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold text-sm text-blue-800 dark:text-blue-300">{msg.displayName}</span>
                            <small className="text-xs text-gray-500">
                              {msg.timestamp?.toDate
                                ? msg.timestamp.toDate().toLocaleString()
                                : new Date(msg.timestamp).toLocaleString()}
                            </small>
                          </div>
                          <p className="mt-1 text-gray-800 dark:text-gray-200 text-sm whitespace-pre-wrap">{msg.text}</p>
                          {msg.image && <img src={msg.image} className="mt-2 w-32 h-32 object-cover rounded-lg" />}
                          <div className="flex gap-2 mt-2 text-xs">
                            <button onClick={() => setReplyTo(msg)} className="text-blue-500 flex items-center gap-1">
                              <FaReply /> Reply
                            </button>
                            <button onClick={() => handleDeleteComment(msg)} className="text-red-500 flex items-center gap-1">
                              <FaTrash /> Delete
                            </button>
                          </div>
                          {/* Replies */}
                          {msg.replies?.length > 0 && (
                            <div className="pl-10 mt-2 space-y-2">
                              {msg.replies.map((rep, i) => (
                                <div key={i} className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <div className="w-7 h-7 flex items-center justify-center bg-blue-600 text-white font-bold rounded-full text-sm">
                                      {rep.displayName?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between">
                                        <span className="font-semibold text-sm text-blue-900 dark:text-blue-300">{rep.displayName}</span>
                                        <small className="text-xs text-gray-500">
                                          {rep.timestamp?.toDate
                                            ? rep.timestamp.toDate().toLocaleString()
                                            : new Date(rep.timestamp).toLocaleString()}
                                        </small>
                                      </div>
                                      <p className="text-sm mt-1 text-gray-700 dark:text-white">{rep.text}</p>
                                      {rep.image && <img src={rep.image} className="mt-1 w-24 h-24 object-cover rounded-lg" />}
                                      <button onClick={() => handleDeleteComment(rep, msg)} className="text-red-300 hover:text-red-400 text-xs mt-1">
                                        Delete
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">Be the first to comment!</p>
              )}
            </div>

            {/* Comment Input */}
            {replyTo && (
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                Replying to <span className="font-semibold">{replyTo.displayName}</span>
                <button onClick={() => setReplyTo(null)} className="ml-2 px-2 py-1 text-xs bg-red-400 rounded text-white">Cancel</button>
              </div>
            )}

            <div className="mt-2 flex flex-col gap-2">
              {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
              {uploadingImage && uploadingImage !== "Uploading..." && (
                <img src={uploadingImage} className="w-24 h-24 object-cover rounded-lg" />
              )}

              <div className="flex gap-2">
                <textarea
                  rows={3}
                  placeholder={replyTo ? "Type your reply... 😊" : "Type a comment... ✍️"}
                  value={replyTo ? replyMessage : newMessage}
                  onChange={(e) => (replyTo ? setReplyMessage(e.target.value) : setNewMessage(e.target.value))}
                  className="flex-1 p-3 border rounded-md dark:bg-gray-900 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  maxLength={200}
                />
                <button onClick={() => setShowEmojiPicker((prev) => !prev)} className="p-3 bg-yellow-400 rounded-md text-white">
                  <FaSmile />
                </button>
                <label className="p-3 bg-green-400 rounded-md text-white cursor-pointer">
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <FaImage />
                </label>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={(!newMessage.trim() && !replyMessage.trim() && !uploadingImage) || loading}
                className={`mt-2 px-4 py-2 rounded-md text-white font-medium ${
                  loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                } transition`}
              >
                {loading ? "Sending..." : replyTo ? "Reply" : "Send"} <IoSend className="inline ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(100,100,100,0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>

      <RecentBlogsWidget/>
    </div>
  );
}
