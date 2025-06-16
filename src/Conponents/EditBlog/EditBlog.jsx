import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../Context/Firebase";
import backImg from "../../Asset/arrow_back.svg";
import blog from "../../Asset/Book study.jpg";

function Edit() {
  const [userData, setUserData] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      const docRef = doc(db, "Blogs", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };
    fetchBlog();
  }, [id]);

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!userData.title || !userData.desc) {
      alert("Title and description are required.");
      return;
    }

    setIsSaving(true);

    try {
      const docRef = doc(db, "Blogs", id);

      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `blog-images/${id}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        await updateDoc(docRef, { ...userData, image: imageUrl });
      } else {
        await updateDoc(docRef, userData);
      }

      alert("✅ Changes saved successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("❌ Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-6 py-8 text-gray-900 dark:text-gray-100">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md shadow"
        >
          <img src={backImg} alt="Back arrow" className="w-5 h-5 bg-white p-1 rounded" />
          Back
        </button>

        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`px-6 py-2 rounded-md font-semibold transition text-white flex items-center gap-2
            ${isSaving ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSaving ? (
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </div>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>

      {/* Edit Form */}
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 grid md:grid-cols-2 gap-10">
        {/* Image Section */}
        <div className="flex flex-col items-center gap-5">
          {userData.image ? (
            <img
              style={{ height: "340px" }}
              src={userData.image}
              alt="Blog"
              className="w-full object-cover rounded-md shadow border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div
              style={{ height: "340px" }}
              className="w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 border border-dashed border-gray-400 dark:border-gray-600 rounded-md text-gray-500"
            >
              No Image Selected
            </div>
          )}

          <label
            htmlFor="file"
            className="cursor-pointer bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition w-full text-center"
          >
            Change Image
          </label>
          <input
            id="file"
            type="file"
            accept="image/*"
            onChange={handlePictureChange}
            className="hidden"
          />

          {userData.image && (
            <button
              type="button"
              onClick={() => {
                setUserData((prev) => ({ ...prev, image: null }));
                setImageFile(null);
              }}
              className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md transition"
            >
              Remove Image
            </button>
          )}
        </div>

        {/* Text Section */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="title" className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Edit Title
            </label>
            <input
              id="title"
              type="text"
              value={userData.title || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label htmlFor="desc" className="block mb-2 font-semibold text-gray-700 dark:text-gray-200">
              Edit Description
            </label>
            <textarea
              id="desc"
              rows={7}
              value={userData.desc || ""}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, desc: e.target.value }))
              }
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 transition resize-none"
              placeholder="Write your blog description"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 text-right">
              {userData.desc?.length || 0} characters
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Edit;
