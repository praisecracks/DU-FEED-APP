
/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext"; 
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, signOut, updateProfile } from 'firebase/auth';
import { collection, doc, onSnapshot, query, updateDoc, getDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { toast } from "react-toastify";
import { auth, db } from "../../Context/Firebase";

function Profile() {
  const { currentUser } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [User, setUser] = useState(null);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [notifications, setNotifications] = useState({ email: false, push: false });
  const [darkMode, setDarkMode] = useState(false); // 🌙 dark mode state
  const [userData, setUserData] = useState({
    name: currentUser?.displayName,
    email: currentUser?.email,
    profilePicture: currentUser?.photoURL || '/default-profile.jpg',
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

  // 🔁 Apply dark mode class
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

  const handleDeletePicture = () => {
    setUserData((prev) => ({
      ...prev,
      profilePicture: '/default-profile.jpg',
    }));
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

          await user.updateEmail(userData.email);
          await updateDoc(doc(db, "Users", user.uid), { email: userData.email });

          toast.success("Email updated successfully!");
        } else {
          toast.info("Email change cancelled.");
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
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <Link to="/home" className="text-blue-500">Home</Link>
      </div>

      <div className="flex flex-col md:flex-row items-center mb-6">
        <div className="relative">
          <img className="w-32 h-32 rounded-full object-cover" src={userData.profilePicture} alt="Profile" />
          {isEditing && (
            <>
              <label htmlFor="file" className="absolute bottom-0 right-0 bg-gray-800 text-white p-1 rounded-full">
                <input type="file" id="file" accept="image/*" onChange={handlePictureChange} className="hidden" />
                <span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

                </span>
              </label>
              <button onClick={handleDeletePicture} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>

              </button>
            </>
          )}
        </div>

        <div className="ml-6 flex-1">
          {isEditing ? (
            <div className="flex gap-4">
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="border p-2 mb-4 rounded"
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="border p-2 mb-4 rounded"
              />
              <button onClick={handleSave} className="bg-blue-500 text-white rounded">Save</button>
              
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p>{userData.email}</p>
              <button onClick={handleEditToggle} className="text-blue-500 mt-2">Edit Profile</button>
            </>
          )}
        </div>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold">Profile Details</h2>
        <ul className="mt-4">
          <li><strong>Username:</strong> {currentUser?.displayName}</li>
          <li><strong>Email:</strong> {currentUser?.email}</li>
          <li><strong>Joined:</strong> {new Date(User?.RegisteredTime).toLocaleString()}</li>
        </ul>
      </div>

      <div className="bg-white p-4 rounded-md shadow-md mb-6">
        <h2 className="text-lg font-semibold">Notification Settings</h2>
        <label className="block mb-2">
          <input type="checkbox" checked={notifications.email} onChange={() => handleNotificationChange("email")} className="mr-2" />
          Enable Email Notifications
        </label>
        <label>
          <input type="checkbox" checked={notifications.push} onChange={() => handleNotificationChange("push")} className="mr-2" />
          Enable Push Notifications
        </label>
      </div>

      <div className="mb-6">
        <button onClick={handleDarkModeToggle} className="bg-gray-800 text-white p-2 rounded-[5px]">
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>

      <div className="flex gap-4">
        <button onClick={handleDeleteAccount} className="bg-red-500 text-white p-2 rounded-[5px]">Delete Account</button>
        <button onClick={handleLogOut} className="bg-gray-800 text-white p-2 rounded-[5px]">Log Out</button>
      </div>
    </div>
  );
}

export default Profile;
