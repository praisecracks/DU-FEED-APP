import { useState } from "react";
import "./Setting.css";
import profilePic from '../../Asset/Book study.jpg';
import setting from '../../Asset/setting.svg'
import edit from '../../Asset/edit.svg'
import back from '../../Asset/arrow_back.svg'

function Settings() {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProfileSave = () => {
    setIsEditing(false);
    // Handle saving the profile data (e.g., update the state or make an API call)
  };

  return (
    <div className="settings-page">
      
      <div className="settings-container">
        <div className="setting-back-img" onClick={() => window.history.back()}>
          <img className="back" src={back} alt="" />
        </div>
        <div className="setting-head" >
          <h1>Settings</h1>
          <img src={setting} alt="" />
        </div>

        {/* Personal Information Section */}
        <div className="section">
          <h2 className="PI">Personal Information</h2>
          <div className="profile-info">
            <img
              src={profilePic}
              alt="Profile"
              className="profile-pic"
            />
            <div className="edit-profile-pic">
              <img src={edit} alt="" />
            </div>
            {isEditing ? (
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your name"
              />
            ) : (
              <p style={{fontSize: "20px", color: "#000"}}>{username}</p>
            )}
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            ) : (
              <p>{email}</p>
            )}


            {isEditing ? (
              <button onClick={handleProfileSave}>Save Changes</button>
            ) : (
              <button className="editButton" onClick={() => setIsEditing(true)}> <p>Edit profile</p> <img className="pen" src={edit} alt="" /></button>
            )}



          </div>
        </div>

        {/* Change Password Section */}
        <div className="section">
          <h2>Change Password</h2>
          <div className="password-change">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Current Password"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />
            <button onClick={togglePasswordVisibility}>
              {showPassword ? "Hide" : "Show"} Password
            </button>
          </div>

          <button onClick={() => alert("Password changed successfully")}>
            Change Password
          </button>
        </div>


        {/* Notification Settings Section */}
        <div className="sectional">
          <h2>Notification Settings</h2>
          <label>
            <input type="checkbox" /> Enable Email Notifications
          </label>
          <br />
          <label>
            <input type="checkbox" /> Enable Push Notifications
          </label>
        </div>

        
        {/* Account Settings Section */}
        <div className="section  DeleteAccount">
          <h2>Account Settings</h2>
          <button className="delete" onClick={() => alert("Account deleted successfully")}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
