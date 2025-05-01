import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../Context/Firebase";

const useDeletePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deletePost = async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const postRef = doc(db, "Blogs", postId); // Specify the document path
      await deleteDoc(postRef); // Delete the document
      return { success: true };
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.message || "Failed to delete the post.");
      return { success: false, error: err };
    } finally {
      setLoading(false);
    }
  };

  return { deletePost, loading, error };
};

export default useDeletePost;
