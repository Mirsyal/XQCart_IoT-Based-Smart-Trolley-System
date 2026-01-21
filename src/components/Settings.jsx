import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../firebase.js";
import { ref, get, remove } from "firebase/database";
import { deleteUser } from "firebase/auth";
import profilePic from "../assets/profile.png";

function Settings() {
  const [userProfile, setUserProfile] = useState({ username: "", email: "", photoURL: "" });
  const [showModal, setShowModal] = useState(false);
  const [confirmInput, setConfirmInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [deletionSuccess, setDeletionSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(""); // <-- added for tooltip
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const sessionRef = ref(db, "sessions/currentSession/uid");
        const sessionSnap = await get(sessionRef);
        const uid = sessionSnap.val();
        if (!uid) return;

        const userRef = ref(db, `users/${uid}`);
        const userSnap = await get(userRef);
        const data = userSnap.val();

        if (data) {
          setUserProfile({
            username: data.username || "",
            email: data.email || "",
            photoURL: data.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedText(text); // show tooltip
        setTimeout(() => setCopiedText(""), 1500); // hide after 1.5s
      })
      .catch(err => console.error("Failed to copy:", err));
  };

  const handleDeleteAccountClick = () => {
    setShowModal(true);
    setConfirmInput("");
    setErrorMessage("");
    setDeletionSuccess(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setConfirmInput("");
    setErrorMessage("");
  };

  const handleConfirmDelete = async () => {
    if (confirmInput !== "xqcart") {
      setErrorMessage(
        <>You must type <strong>xqcart</strong> to confirm.</>
      );
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user is currently logged in");

      const uid = user.uid;

      await deleteUser(user);
      await remove(ref(db, `users/${uid}`));
      await remove(ref(db, `sessions/currentSession`));

      setDeletionSuccess(true);
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error("Error deleting account:", err);
      setErrorMessage(
        err.code === "auth/requires-recent-login"
          ? "You need to log in again before deleting your account."
          : err.message || "Failed to delete account."
      );
    }
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
          src={userProfile.photoURL || profilePic}
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
            onClick={() => navigate("/profile")}
          >
            Edit Profile
          </div>
        </div>
      </div>

      {/* Contact Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px", position: "relative" }}>
        {/* Email Support */}
        <a
          href="mailto:215569@student.upm.edu.my"
          style={{
            padding: "15px",
            borderRadius: "15px",
            backgroundColor: "#f8f8f8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          }}
          onClick={() => copyToClipboard("215569@student.upm.edu.my")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08)";
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 500 }}>Email Support</span>
          <span style={{ fontSize: "12px", color: "#999" }}>215569@student.upm.edu.my</span>
        </a>

        {/* Call Support */}
        <a
          href="tel:+601119466039"
          style={{
            padding: "15px",
            borderRadius: "15px",
            backgroundColor: "#f8f8f8",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            textDecoration: "none",
            color: "inherit",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
          }}
          onClick={() => copyToClipboard("+601119466039")}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.08)";
          }}
        >
          <span style={{ fontSize: "16px", fontWeight: 500 }}>Call Support</span>
          <span style={{ fontSize: "12px", color: "#999" }}>+601119466039</span>
        </a>

        {/* Tooltip below the contact boxes */}
        {copiedText && (
          <div
            style={{
              marginTop: "8px",
              backgroundColor: "#333",
              color: "#fff",
              padding: "6px 10px",
              borderRadius: "8px",
              fontSize: "12px",
              width: "fit-content",
              textAlign: "center",
              alignSelf: "center",
              opacity: 0.9,
              transition: "opacity 0.3s",
            }}
          >
            {copiedText} copied!
          </div>
        )}
      </div>

      {/* Delete Account Button */}
      <button
        onClick={handleDeleteAccountClick}
        style={{
          width: "100%",
          marginTop: "50px",
          padding: "14px",
          borderRadius: "12px",
          border: "none",
          backgroundColor: "#950606",
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

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "10px",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "20px",
              padding: "20px",
              maxWidth: "360px",
              width: "90%",  // shrink modal on mobile
              boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
              textAlign: "center",
            }}
          >
            {!deletionSuccess ? (
              <>
                <h3 style={{ marginBottom: "10px", fontSize: "20px", fontWeight: 600, color: "#950606" }}>
                  Confirm Account Deletion
                </h3>
                <p style={{ marginBottom: "15px", fontSize: "14px", color: "#444" }}>
                  Type <strong>xqcart</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  style={{
                    width: "80%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid #ccc",
                    marginBottom: "12px",
                    textAlign: "center",
                    fontSize: "14px",
                  }}
                />
                {errorMessage && <div style={{ color: "#ff3b30", marginBottom: "12px", fontSize: "13px" }}>{errorMessage}</div>}
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                  <button
                    onClick={handleConfirmDelete}
                    style={{
                      flex: "1 1 120px",
                      padding: "10px 0",
                      borderRadius: "12px",
                      border: "none",
                      backgroundColor: "#ff3b30",
                      color: "white",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={handleCancel}
                    style={{
                      flex: "1 1 120px",
                      padding: "10px 0",
                      borderRadius: "12px",
                      border: "1px solid #ccc",
                      backgroundColor: "white",
                      color: "#333",
                      cursor: "pointer",
                      fontSize: "14px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <div>
                <h3 style={{ fontSize: "20px", fontWeight: 600, color: "#333" }}>Account Deleted!</h3>
                <p style={{ fontSize: "14px", color: "#555" }}>Your account has been removed successfully.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
