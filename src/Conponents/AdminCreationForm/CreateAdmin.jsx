import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../Context/Firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

function CreateAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "Users", user.uid), {
        email: email,
        role: "subadmin",
        createdAt: new Date(),
      });

      toast.success("Sub Admin created successfully!");
      navigate("/admin");
    } catch (error) {
      toast.error("Error creating sub admin: " + error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-10 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
        Create Sub Admin
      </h2>
      <p style={{marginTop: "-20px"}} className="mb-10 text-center text-white/50">going to be redirected! . . .</p>

      <form onSubmit={handleCreateAdmin} className="flex flex-col gap-6">
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Create Sub Admin
        </button>
      </form>
    </div>
  );
}

export default CreateAdmin;
