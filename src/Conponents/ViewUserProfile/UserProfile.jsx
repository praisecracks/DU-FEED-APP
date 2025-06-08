import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/Firebase";
import { getAuth } from "firebase/auth";
import defaultPic from "../../Asset/Profile.svg";

function UserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams(); // This is required now, do not fallback to current user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewerRole, setViewerRole] = useState(""); // to track current viewer's role

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (!currentUser) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        // Get profile of the logged-in viewer
        const viewerDoc = await getDoc(doc(db, "Users", currentUser.uid));
        if (viewerDoc.exists()) {
          setViewerRole(viewerDoc.data().role || "");
        }

        // Get profile of the blog post author
        if (!userId) {
          console.error("Missing userId in URL");
          setUser(null);
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, "Users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error("User not found in Firestore.");
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, userId]);

  if (loading) return <div>Loading user profile...</div>;
  if (!user) return <div>User not found or an error occurred.</div>;

  const isViewerAdmin = viewerRole === "Admin";
  const isViewerSubadmin = viewerRole === "Subadmin";

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col items-center mb-4">
        <img
          src={user.profilePicture || defaultPic}
          alt="User Profile"
          className="rounded-full w-24 h-24 object-cover mb-2 border-2"
        />
        <h1 className="text-xl font-semibold">{user.name || "Anonymous"}</h1>
        <p className="text-gray-600">Email: {user.email || "N/A"}</p>
        <p className="text-gray-600">Bio: {user.bio || "No bio available."}</p>
      </div>

      {(isViewerAdmin || isViewerSubadmin) && (
        <div className="flex justify-between mt-4 items-center w-full px-4 py-2 bg-gray-100 rounded-md">
          <button className="bg-yellow-500 text-white px-3 py-1 rounded">
            Disable User
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded">
            Delete User
          </button>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
