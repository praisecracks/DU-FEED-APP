/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  signOut, 
  updateProfile, 
  updateEmail 
} from 'firebase/auth';
import { collection, doc, getDocs, onSnapshot, updateDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db } from "../../Context/Firebase";
import { FaCamera, FaTrash, FaSun, FaMoon } from 'react-icons/fa';

export default function Profile() {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({ email: false, push: false });
  const [userData, setUserData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    profilePicture: currentUser?.photoURL || '/Profile.svg',
  });
  const [recentBlogs, setRecentBlogs] = useState([]);

  // Listen to user data changes
  useEffect(() => {
    const userRef = doc(db, "Users", currentUser?.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserData(prev => ({
          ...prev,
          name: data.name || currentUser?.displayName,
          email: data.email || currentUser?.email,
          profilePicture: data.profilePicture || '/Profile.svg'
        }));
        setNotifications({
          email: data.emailNotifications || false,
          push: data.pushNotifications || false,
        });
      }
    });
    return () => unsubscribe();
  }, [currentUser?.uid]);

  // Fetch recent blogs based on user interests
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const userSnap = await getDoc(doc(db, "Users", currentUser.uid));
        const interests = userSnap.data()?.interests || [];

        const blogSnap = await getDocs(collection(db, "Blogs"));
        let blogs = [];
        blogSnap.forEach(doc => {
          const data = doc.data();
          if (data.category && interests.includes(data.category)) {
            blogs.push({ id: doc.id, ...data });
          }
        });

        blogs = blogs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds).slice(0, 5);
        setRecentBlogs(blogs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecentBlogs();
  }, [currentUser.uid]);

  // Dark mode
  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);
  const handleDarkModeToggle = () => setDarkMode(prev => !prev);

  const handleEditToggle = () => setIsEditing(prev => !prev);
  const handleInputChange = (e) => setUserData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNotificationChange = async (type) => {
    const updatedNotifications = { ...notifications, [type]: !notifications[type] };
    setNotifications(updatedNotifications);

    try {
      await updateDoc(doc(db, "Users", currentUser.uid), {
        emailNotifications: updatedNotifications.email,
        pushNotifications: updatedNotifications.push
      });
      toast.success("Notification settings updated!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update notifications.");
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageRef = ref(getStorage(), `profile_pictures/${currentUser.uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', null,
      (error) => toast.error("Error uploading image."),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await updateProfile(currentUser, { photoURL: downloadURL });
        await updateDoc(doc(db, "Users", currentUser.uid), { profilePicture: downloadURL });
        setUserData(prev => ({ ...prev, profilePicture: downloadURL }));
        toast.success("Profile picture updated!");
      }
    );
  };

  const handleDeletePicture = async () => {
    try {
      await updateProfile(currentUser, { photoURL: '/Profile.svg' });
      await updateDoc(doc(db, "Users", currentUser.uid), { profilePicture: '/Profile.svg' });
      setUserData(prev => ({ ...prev, profilePicture: '/Profile.svg' }));
      toast.success("Profile picture deleted.");
    } catch (err) {
      toast.error("Failed to delete profile picture.");
    }
  };

  const handleSave = async () => {
    try {
      if (userData.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: userData.name });
        await updateDoc(doc(db, "Users", currentUser.uid), { name: userData.name });
      }

      if (userData.email !== currentUser.email) {
        const password = window.prompt("Enter password to change email:");
        if (!password) return toast.info("Email change cancelled.");

        const credential = EmailAuthProvider.credential(currentUser.email, password);
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, userData.email);
        await updateDoc(doc(db, "Users", currentUser.uid), { email: userData.email });
        toast.success("Email updated!");
      }

      await currentUser.reload();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. " + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    const password = window.prompt("Enter password to delete account:");
    if (!password) return;
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);
      await currentUser.delete();
      toast.success("Account deleted. Redirecting...");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  const handleLogOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="profile-container mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors relative">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <Link to="/home" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">← Back to Home</Link>
        <button 
          onClick={handleDarkModeToggle} 
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Profile Section */}
      <div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12 transition">
        {/* Profile Picture */}
        <div className="relative group w-40 h-40 md:w-44 md:h-44 flex-shrink-0">
          <img
            src={userData.profilePicture}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-lg"
          />
          {isEditing && (
            <>
              <label
                htmlFor="file"
                className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full cursor-pointer shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change Profile Picture"
              >
                <input type="file" id="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
                <FaCamera size={18} />
              </label>
              <button
                onClick={handleDeletePicture}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                title="Delete Profile Picture"
              >
                <FaTrash size={18} />
              </button>
            </>
          )}
        </div>

        {/* User Info & Controls */}
        <div className="flex-1 w-full max-w-lg flex flex-col gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{userData.name}</h2>
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm select-none">Active</span>
          </div>
          <p className="text-gray-600 dark:text-gray-300 break-words">{userData.email}</p>

          {isEditing ? (
            <div className="mt-4 space-y-4">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleEditToggle}
              className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}

          {/* Notifications */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Notification Settings</h3>
            <div className="flex flex-col gap-3 max-w-sm">
              {["email", "push"].map(type => (
                <label key={type} className="flex items-center justify-between cursor-pointer bg-gray-100 dark:bg-gray-700 rounded-full p-2">
                  <span className="text-gray-700 dark:text-gray-300 capitalize">{type} Notifications</span>
                  <input
                    type="checkbox"
                    checked={notifications[type]}
                    onChange={() => handleNotificationChange(type)}
                    className="form-checkbox h-5 w-5 text-blue-600 rounded transition"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Account Actions */}
          <div className="mt-8 flex flex-col md:flex-row gap-4 md:gap-6">
            <button
              onClick={handleDeleteAccount}
              className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete Account
            </button>
            <button
              onClick={handleLogOut}
              className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Floating Recent Blogs Panel */}
      <div className="fixed right-6 top-1/4 w-64 bg-white dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl p-4 transition-transform transform hover:translate-x-0 translate-x-16 z-50">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3">Your Tips</h3>
        {recentBlogs.length ? (
          <ul className="flex flex-col gap-2">
            {recentBlogs.map(blog => (
              <li key={blog.id} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer">
                {blog.title}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No recent tips available.</p>
        )}
      </div>
    </div>
  );
}
