import { useState, useEffect } from "react";
import { db } from "../firebase.js";
import { ref, get } from "firebase/database";
import profilePic from "../assets/profile.png"; // default profile pic

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1️⃣ Get current session UID
        const sessionRef = ref(db, "sessions/currentSession/uid");
        const sessionSnap = await get(sessionRef);
        const uid = sessionSnap.val();
        if (!uid) return;

        // 2️⃣ Fetch user data
        const userRef = ref(db, `users/${uid}`);
        const userSnap = await get(userRef);
        const data = userSnap.val();

        if (data) {
          setUsername(data.username || "");
          setEmail(data.email || "");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = () => {
    alert("Save button clicked!"); // dummy action
  };

  const handleChangePhoto = () => {
    alert("Change photo clicked!"); // dummy action
  };

  const handleChangePassword = () => {
    alert("Change Password clicked!"); // dummy action
  };

  return (
    <div style={{ padding: "25px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Edit Profile</h2>

      {/* Profile Photo */}
      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
          src={profilePic}
          alt="Profile"
          style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
        />
        <div
          onClick={handleChangePhoto}
          style={{
            marginTop: "10px",
            fontSize: "14px",
            color: "#c85a00",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          Change Photo
        </div>
      </div>

      {/* Username Field */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "14px", marginBottom: "5px", display: "block" }}>Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            boxSizing: "border-box",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Email Field */}
      <div style={{ marginBottom: "5px" }}>
        <label style={{ fontSize: "14px", marginBottom: "5px", display: "block" }}>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            boxSizing: "border-box",
            fontSize: "14px",
          }}
        />
      </div>

      {/* Change Password Text below Email */}
      <div
        onClick={handleChangePassword}
        style={{
          fontSize: "12px",
          color: "#c85a00",
          marginBottom: "30px",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        Change Password
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#ff6600",
          color: "white",
          fontWeight: 600,
          fontSize: "16px",
          cursor: "pointer",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
      >
        Save Changes
      </button>
    </div>
  );
}

export default Profile;
