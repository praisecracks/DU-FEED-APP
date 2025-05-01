import { useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "../Context/Firebase";
import { useUser } from "../Context/UserContext";

const useLikePost = (postId, userId) => {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
    const { currentUser } = useUser();
  

  // Fetch the initial likes (optional if you already have this data)
  const fetchLikes = async () => {
    try {
      const postRef = doc(db, "Blogs", postId);
      const postSnap = await getDoc(postRef);

      if (postSnap.exists()) {
        setLikes(postSnap.data().likes || []);
      }
    } catch (err) {
      console.error("Error fetching likes:", err);
      setError(err.message);
    }
  };

  // Handle the like action
  const likePost = async () => {
    if (likes.includes(userId)) {
      console.log("User has already liked this post.");
      return;
    }

    setLoading(true);
    const postRef = doc(db, "Blogs", postId);

    try {
      // Update the likes in Firebase
      if (currentUser) {
        await updateDoc(postRef, {
          likes: arrayUnion(userId),
        });
      }
      else{
        alert("please login to like this blog ")
      }
      // Update the local state
      setLikes((prevLikes) => [...prevLikes, userId]);
    } catch (err) {
      console.error("Error liking the post:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle the unlike action (optional)
  const unlikePost = async () => {
    if (!likes.includes(userId)) {
      console.log("User hasn't liked this post.");
      return;
    }

    setLoading(true);
    const postRef = doc(db, "Blogs", postId);

    try {
      // Remove the user ID from the likes array in Firebase
      await updateDoc(postRef, {
        likes: arrayRemove(userId),
      });

      // Update the local state
      setLikes((prevLikes) => prevLikes.filter((id) => id !== userId));
    } catch (err) {
      console.error("Error unliking the post:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { likes, loading, error, likePost, unlikePost, fetchLikes };
};

export default useLikePost;
