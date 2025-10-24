import { useState, useRef } from "react";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { useUser } from "../../Context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Header from "../../Containers/Header/Header";

function Create() {
  const [imageURL, setImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [file, setFile] = useState(null);
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => setImageURL(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      const reader = new FileReader();
      reader.onload = () => setImageURL(reader.result);
      reader.readAsDataURL(droppedFile);
    }
  };

  const handleImageUpload = async () => {
    if (!file) return null;

    const storage = getStorage();
    const storageRef = ref(storage, `blogs/${file.name}_${Date.now()}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  };

  const handleUploadBlog = async () => {
    setIsLoading(true);

    try {
      if (!blogTitle.trim()) {
        toast.error("Title is required");
        setIsLoading(false);
        return;
      }

      const imageUrl = await handleImageUpload();
      const scheduled = scheduledDate ? new Date(scheduledDate) : new Date();

      const blog = {
        image: imageUrl || null,
        title: blogTitle.trim(),
        desc: blogText.trim(),
        authId: currentUser?.uid || "unknown",
        authorName: currentUser?.displayName || "Unknown",
        authorImg: currentUser?.photoURL || null,
        date: Timestamp.fromDate(scheduled),
        isVerified: false,
        likes: [],
        dislikes: [],
        comments: [],
        userId: currentUser?.uid || "anonymous",
        isAdmin: currentUser?.role === "admin" || false
      };

      await addDoc(collection(db, "Blogs"), blog);
      toast.success("Blog uploaded! Wait for admin verification.");
      navigate("/my-blogs");
    } catch (error) {
      console.error(error.message);
      toast.error("Failed to upload blog. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-10 pt-28">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-700 dark:text-gray-200">
          Create a New Blog
        </h1>

        {/* Drag and Drop Area */}
        <div
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center bg-white dark:bg-gray-800 cursor-pointer hover:border-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current.click()}
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {imageURL ? (
            <img
              src={imageURL}
              alt="Selected Preview"
              className="h-60 w-full object-cover rounded-md mb-4"
            />
          ) : (
            <div className="flex flex-col items-center">
              <svg
                className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0H3m4 0h4m1 16h6m-3-6h2a2 2 0 002-2V4a2 2 0 00-2-2h-2m-3 6H4a2 2 0 00-2 2v10a2 2 0 002 2h6a2 2 0 002-2v-6z"
                />
              </svg>
              <p className="text-gray-500 dark:text-gray-400">
                Drag & Drop or Click to upload an image
              </p>
            </div>
          )}
        </div>

        {/* Blog Form */}
        <div className="mt-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="title" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Content Title
            </label>
            <input
              id="title"
              type="text"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your blog title..."
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Blog Content
            </label>
            <textarea
              id="content"
              rows="8"
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Write your blog content here..."
            ></textarea>
          </div>

          <div>
            <label htmlFor="schedule" className="block text-gray-700 dark:text-gray-200 font-semibold mb-2">
              Schedule Publish (Optional)
            </label>
            <input
              id="schedule"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            onClick={handleUploadBlog}
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
          >
            {isLoading ? "Publishing..." : "Publish Blog"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Create;
