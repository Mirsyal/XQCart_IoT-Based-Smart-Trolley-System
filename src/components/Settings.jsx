import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import { db } from "../firebase.js";
import { ref, get } from "firebase/database";
import profilePic from "../assets/profile.png";

function Settings() {
  const [userProfile, setUserProfile] = useState({ username: "", email: "" });
  const navigate = useNavigate(); // <-- initialize navigate

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // 1️⃣ Get current session UID
        const sessionRef = ref(db, "sessions/currentSession/uid");
        const sessionSnap = await get(sessionRef);
        const uid = sessionSnap.val();

        if (!uid) return;

        // 2️⃣ Get username & email from users node
        const userRef = ref(db, `users/${uid}`);
        const userSnap = await get(userRef);
        const data = userSnap.val();

        if (data) {
          setUserProfile({
            username: data.username || "",
            email: data.email || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSectionClick = (section) => {
    alert(`Navigate to ${section} page`);
  };

  const handleDeleteAccount = () => {
    alert("Delete Account clicked!"); // dummy action for now
  };

  return (
    <div style={{ padding: "25px", fontFamily: "Arial, sans-serif", maxWidth: "500px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Settings</h2>

      {/* Profile Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          padding: "15px",
          borderRadius: "15px",
          backgroundColor: "#f8f8f8",
          marginBottom: "20px",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)";
          e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08)";
        }}
      >
        <img
          src={profilePic}
          alt="Profile"
          style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", border: "2px solid #ddd" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "18px", fontWeight: 600 }}>{userProfile.username}</div>
          <div style={{ fontSize: "14px", color: "#666" }}>{userProfile.email}</div>
          <div
            style={{
              fontSize: "12px",
              color: "#c85a00",
              marginTop: "3px",
              cursor: "pointer",
              display: "inline-block",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
            onClick={() => navigate("/profile")} // navigate to Profile page
          >
            Edit Profile
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {["Notifications", "Privacy & Security", "Support & Info"].map((section) => (
          <div
            key={section}
            style={{
              padding: "15px",
              borderRadius: "15px",
              backgroundColor: "#f8f8f8",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
            }}
            onClick={() => handleSectionClick(section)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08)";
            }}
          >
            <span style={{ fontSize: "16px", fontWeight: 500 }}>{section}</span>
            <span style={{ fontSize: "18px", color: "#888" }}>›</span>
          </div>
        ))}
      </div>

      {/* Delete Account Button */}
      <button
        onClick={handleDeleteAccount}
        style={{
          width: "100%",
          marginTop: "30px",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#ff3b30", // red
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
        Delete Account
      </button>
    </div>
  );
}

export default Settings;
