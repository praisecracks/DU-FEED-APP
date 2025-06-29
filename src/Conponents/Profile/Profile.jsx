/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut, updateProfile, updateEmail } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db } from "../../Context/Firebase";

import { FaSun, FaMoon, FaCamera, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

function Profile() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [User, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({ email: false, push: false });
  const [darkMode, setDarkMode] = useState(false);
  const [userData, setUserData] = useState({
    name: currentUser?.displayName,
    email: currentUser?.email,
    profilePicture: currentUser?.photoURL || '/Profile.svg',
  });

  useEffect(() => {
    setIsLoading(true);

    const userRef = doc(db, "Users", currentUser?.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUser(docSnap.data());
        setNotifications({
          email: docSnap.data().emailNotifications || false,
          push: docSnap.data().pushNotifications || false,
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleDarkModeToggle = () => setDarkMode((prev) => !prev);

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = async (type) => {
    const updatedNotifications = { ...notifications, [type]: !notifications[type] };
    setNotifications(updatedNotifications);

    try {
      const userRef = doc(db, "Users", currentUser?.uid);
      await updateDoc(userRef, {
        emailNotifications: updatedNotifications.email,
        pushNotifications: updatedNotifications.push,
      });
      toast.success("Notification settings updated!");
    } catch (error) {
      console.error("Error updating notifications:", error);
      toast.error("Failed to update notifications.");
    }
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storage = getStorage();
      const user = auth.currentUser;

      if (!user) {
        toast.error('No user is signed in.');
        return;
      }

      const storageRef = ref(storage, `profile_pictures/${user.uid}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        () => {},
        (error) => {
          console.log(error);
          toast.error('Error uploading the image.');
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            updateProfile(user, { photoURL: downloadURL })
              .then(async () => {
                await auth.currentUser.reload();
                setUserData((prev) => ({ ...prev, profilePicture: auth.currentUser.photoURL }));
                toast.success("Profile picture updated successfully!");
              })
              .catch((error) => {
                console.log(error);
                toast.error("Failed to update profile picture.");
              });
          });
        }
      );
    }
  };

  const handleDeletePicture = async () => {
    try {
      const user = auth.currentUser;
      await updateProfile(user, { photoURL: '/Profile.svg' });
      await updateDoc(doc(db, "Users", user.uid), { profilePicture: '/Profile.svg' });
      setUserData(prev => ({ ...prev, profilePicture: '/Profile.svg' }));
      toast.success("Profile picture deleted.");
    } catch (error) {
      toast.error("Failed to delete profile picture.");
    }
  };

  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      if (userData.name !== currentUser?.displayName) {
        await updateProfile(user, { displayName: userData.name });
        await updateDoc(doc(db, "Users", user.uid), { name: userData.name });
      }

      if (userData.email !== currentUser?.email) {
        const password = window.prompt("Please confirm your password to change email:");

        if (password) {
          const credential = EmailAuthProvider.credential(currentUser.email, password);
          await reauthenticateWithCredential(user, credential);

          await updateEmail(user, userData.email);
          await updateDoc(doc(db, "Users", user.uid), { email: userData.email });

          toast.success("Email updated successfully!");
        } else {
          toast.info("Email change cancelled.");
          return;
        }
      }

      await user.reload();
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. " + error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const Password = window.prompt("Enter password to delete account");
    const user = currentUser;
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(user.email, Password);
        await reauthenticateWithCredential(user, credential);
        await user.delete();
        toast.success("Account Deleted. Redirecting...");
        navigate("/");
      } catch (error) {
        console.error('Error deleting account:', error.message);
        toast.error(error.message);
      }
    }
  };

  const handleLogOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <div className="profile-container  mx-auto p-6 bg-gray-900 min-h-screen w-100">
      <div className="flex items-center justify-between mb-6">
        <Link to="/home" className="text-blue-600 hover:text-blue-900 font-medium transition">← Back to Home</Link>
      
      </div>

<div className="bg-white/60 dark:bg-gray-800/40 backdrop-blur-md p-8 rounded-3xl shadow-xl flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">        <div className="relative group">
          <img
            className="w-36 h-36 md:w-40 md:h-40 rounded-full object-cover border-4 border-blue-500 shadow-lg"
            src={userData.profilePicture}
            alt="Profile"
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
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg transition"
                title="Delete Profile Picture"
              >
                <FaTrash size={18} />
              </button>
            </>
          )}
        </div>

        <div className="flex-1 w-full max-w-lg">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{userData.name}</h2>
            <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm select-none">Active</span>
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-300 break-words text-left">{userData.email}</p>

          {isEditing ? (
            <div className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-300 dark:text-gray-100 hover:bg-gray-600 dark:hover:bg-gray-600 transition"
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
              className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Edit Profile
            </button>
          )}

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Notification Settings</h3>
            <div className="flex flex-col gap-3 max-w-sm">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={() => handleNotificationChange('push')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-gray-700 dark:text-gray-300">Push Notifications</span>
              </label>
            </div>
          </div>

          <div className="mt-12 flex flex-col md:flex-row gap-4 md:gap-6">
            <button
              onClick={handleDeleteAccount}
              className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete Account
            </button>
            <button
              onClick={handleLogOut}
              className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-200 hover:bg-gray-800 dark:hover:bg-gray-700 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
