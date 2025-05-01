import { useState } from "react";
import "./Profile.css";
import goback from '../Images/arrow_back.svg'
import back from '../Images/upload.svg'
import del from "../Images/delete.svg"
import logout from '../Images/logout.svg'
import save from '../Images/save.svg'
import Settings from "../Setting/Setting";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState({
    name: "Joe Crack",
    email: "johndoe@example.com",
    password: "",
    profilePicture: "https://via.placeholder.com/150",
  });

  const handleEditToggle = () => setIsEditing((prev) => !prev);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUserData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePicture = () => {
    setUserData((prev) => ({
      ...prev,
      profilePicture: "https://via.placeholder.com/150",
    }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSave = () => {
    // Perform save operation (e.g., send data to the backend)
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deleted!");
      // Redirect or handle account deletion logic here
    }
  };

  return (
    <div className="profile-container">
      <div className="goBack">
        <img src={goback} alt="" />
      </div>
      <div className="profile-header">
        <div className="profile-picture">
          <img className="gg" src={userData.profilePicture} alt="Profile" />
          {isEditing && (
            <>
              <label htmlFor="file">Upload Image  <img src={back} alt="" /></label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handlePictureChange}
                className="file-input"
              />
              <button
                type="button"
                onClick={handleDeletePicture}
                className="delete-picture-button"
              >
                Remove Image
                <img src={del} alt="" />
              </button>
            </>
          )}
        </div>

        <div className="profile-info">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleInputChange}
                placeholder="Name"
                className="input-field"
              />

              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="input-field"
              />
              <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  placeholder="New Password"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="toggle-password"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <button className="save-button" onClick={handleSave}>
                Save
                <img src={save} alt="" />
              </button>
            </>
          ) : (
            <div>
              <h1 className="profile-name">{userData.name}</h1>
              <p className="profile-email">{userData.email}</p>
              <button className="edit-button" onClick={handleEditToggle}>
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="profile-details">
        <h2>Profile Details</h2>
        <ul>
          <li>
            <strong>Role:</strong> Frontend Developer
          </li>
          <li>
            <strong>Joined:</strong> January 2022
          </li>
        </ul>
      </div>
      <div className="profile-actions">
        <button className="delete-button" onClick={handleDeleteAccount}>
          Delete Account
          <img src={del} alt="" />
        </button>
        <button className="logout-button">Log Out  <img src={logout} alt="" /></button>
        <button className="logout-button">More settings  <img src={Settings} alt="" /></button>

      </div>
    </div>
  );
}

export default Profile;
