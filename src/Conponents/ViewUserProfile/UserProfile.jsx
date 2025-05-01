import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../Context/Firebase";

function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Params object:", useParams());  // Check the entire params object

        if (!userId || userId === "undefined") {
            console.error("Invalid user ID:", userId); // More logging
            navigate("/error"); // Redirect to an error page or handle the error
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const userDocRef = doc(db, "Users", userId);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    setUser(userDoc.data());
                } else {
                    console.error("User not found in Firestore for userId:", userId);
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setUser(null);
            }
            setLoading(false);
        };

        fetchUserData();
    }, [userId, navigate]);

    if (loading) return <div>Loading user profile...</div>;
    if (!user) return <div>User not found.</div>;

    return (
        <div>
            <h1>{user.name || "Anonymous"}</h1>
            <p>Email: {user.email || "N/A"}</p>
            <p>Bio: {user.bio || "No bio available."}</p>
        </div>
    );
}

export default UserProfile;
