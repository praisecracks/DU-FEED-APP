import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Context/Firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import "./CreateAdmin.css"

function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      // Create Sub Admin in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store Sub Admin details in Firestore
      await setDoc(doc(db, "Users", user.uid), {
        email: email,
        role: "subadmin",
        createdAt: new Date(),
      });

      toast.success("Sub Admin created successfully!");

      // Navigate back to Admin dashboard after success
      navigate("/admin");

    } catch (error) {
      toast.error("Error creating sub admin: " + error.message);
    }
  };

  return (
    <div className="create-admin-page">
      <h2>Create Sub Admin</h2>
      <form onSubmit={handleCreateAdmin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Create Sub Admin</button>
      </form>
    </div>
  );
} 

export default CreateAdmin;
