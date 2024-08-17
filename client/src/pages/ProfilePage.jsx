import React, { useState, useEffect } from "react";
import api from "../services/api";
import "./../css/ProfilePage.css";

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/user/profile");
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChangePassword = async () => {
    try {
      const response = await api.put("/user/profile/password", {
        currentPassword,
        newPassword,
      });
      alert("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error.response?.data?.error || "Password update failed.");
    }
  };

  return user ? (
    <div className="profile-page">
      <h1>Profile</h1>
      <p>Aadhar Card: {user.aadharCardNumber}</p>
      <input
        type="password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  ) : (
    <p>Loading...</p>
  );
}

export default ProfilePage;
