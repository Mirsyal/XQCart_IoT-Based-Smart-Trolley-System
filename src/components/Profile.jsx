import { useState, useEffect, useRef } from "react";
import { db, auth } from "../firebase.js";
import { ref, get, set } from "firebase/database";
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import profilePic from "../assets/profile.png"; // default profile pic

function Profile() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const fileInputRef = useRef(null);

  // Password modal states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Password strength states
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: "Weak", color: "red" });
  const [showStrengthBar, setShowStrengthBar] = useState(false);

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
          setUsername(data.username || "");
          setEmail(data.email || "");
          setPhotoURL(data.photoURL || "");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSave = async () => {
    try {
      const sessionRef = ref(db, "sessions/currentSession/uid");
      const sessionSnap = await get(sessionRef);
      const uid = sessionSnap.val();
      if (!uid) return showToastMessage("No user session found!", false);

      const userRef = ref(db, `users/${uid}/username`);
      await set(userRef, username);

      showToastMessage("Username updated successfully!", true);
    } catch (err) {
      console.error("Error updating username:", err);
      showToastMessage("Failed to update username.", false);
    }
  };

  const showToastMessage = (message, isSuccess) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "xqcart_profiles");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/deuwd5y69/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };  

  const handleChangePhoto = () => {
    fileInputRef.current.click();
  };

  const handlePhotoSelected = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const sessionRef = ref(db, "sessions/currentSession/uid");
      const sessionSnap = await get(sessionRef);
      const uid = sessionSnap.val();
      if (!uid) return showToastMessage("No user session found!");

      const url = await uploadToCloudinary(file);

      await set(ref(db, `users/${uid}/photoURL`), url);
      setPhotoURL(url);

      showToastMessage("Photo updated successfully!");
    } catch (err) {
      console.error(err);
      showToastMessage("Failed to upload photo.");
    }
  };

  const handleChangePassword = () => {
    setShowPasswordModal(true);
    setNewPass("");
    setConfirmPass("");
    setCurrentPass("");
    setPasswordStrength({ score: 0, label: "Weak", color: "red" });
    setShowStrengthBar(false);
  };
  
  // Calculate password strength
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: "Weak", color: "red" };

    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    let label = "Weak", color = "red";
    if (score <= 2) { label = "Weak"; color = "red"; }
    else if (score <= 4) { label = "Medium"; color = "orange"; }
    else { label = "Strong"; color = "green"; }

    return { score, label, color };
  };

  const handleNewPasswordChange = (value) => {
    setNewPass(value);
    setPasswordStrength(calculatePasswordStrength(value));
  };

  const handlePasswordUpdate = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      return showToastMessage("All fields are required.", false);
    }
    if (newPass !== confirmPass) {
      return showToastMessage("New password and confirm password do not match.", false);
    }
    if (newPass.length < 6) {
      return showToastMessage("Password must be at least 6 characters.", false);
    }

    try {
      const user = auth.currentUser;
      if (!user) return showToastMessage("No user logged in!", false);

      const credential = EmailAuthProvider.credential(user.email, currentPass);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPass);
      showToastMessage("Password changed successfully!", true);

      setShowPasswordModal(false);
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
      setPasswordStrength({ score: 0, label: "Weak", color: "red" });
      setShowStrengthBar(false);
    } catch (err) {
      console.error("Error changing password:", err);
      if (err.code === "auth/wrong-password") {
        showToastMessage("Current password is incorrect.", false);
      } else if (err.code === "auth/requires-recent-login") {
        showToastMessage("Please log in again before changing password.", false);
      } else {
        showToastMessage("Failed to change password.", false);
      }
    }
  };

  return (
    <div style={{ padding: "25px", maxWidth: "500px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ fontSize: "24px", marginBottom: "20px" }}>Edit Profile</h2>

      <div style={{ textAlign: "center", marginBottom: "25px" }}>
        <img
          src={photoURL || profilePic}
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
            textDecoration: "none",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Change Photo
        </div>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handlePhotoSelected}
          style={{ display: "none" }}
        />
      </div>

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

      <div style={{ marginBottom: "5px" }}>
        <label style={{ fontSize: "14px", marginBottom: "5px", display: "block" }}>Email</label>
        <input
          value={email}
          readOnly
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "1px solid #ddd",
            boxSizing: "border-box",
            fontSize: "14px",
            backgroundColor: "#f5f5f5",
            color: "#999",
            cursor: "not-allowed",
          }}
        />
      </div>

      <div
        onClick={handleChangePassword}
        style={{
          fontSize: "12px",
          color: "#c85a00",
          marginBottom: "30px",
          cursor: "pointer",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        Change Password
      </div>

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

      <div
        style={{
          position: "fixed",
          bottom: showToast ? "80px" : "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 20px",
          borderRadius: "8px",
          backgroundColor: toastMessage.includes("successfully") ? "#28a745" : "#dc3545",
          color: "white",
          fontSize: "14px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          transition: "bottom 0.5s ease-in-out",
          zIndex: 1000,
        }}
      >
        {toastMessage}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            animation: "fadeIn 0.3s",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "16px",
              width: "320px",
              boxSizing: "border-box",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              transform: "translateY(0)",
              animation: "slideIn 0.3s",
            }}
          >
            <h3 style={{ marginBottom: "20px", textAlign: "center" }}>Change Password</h3>

            {/* Current Password */}
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <input
                type={showCurrentPass ? "text" : "password"}
                placeholder="Current Password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
              <img
                src={showCurrentPass ? "/eyeopen.png" : "/eyeclose.png"}
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* New Password */}
            <div style={{ position: "relative", marginBottom: "6px" }}>
              <input
                type={showNewPass ? "text" : "password"}
                placeholder="New Password"
                value={newPass}
                onChange={(e) => handleNewPasswordChange(e.target.value)}
                onFocus={() => setShowStrengthBar(true)}
                onBlur={() => { if (!newPass) setShowStrengthBar(false); }}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
              <img
                src={showNewPass ? "/eyeopen.png" : "/eyeclose.png"}
                onClick={() => setShowNewPass(!showNewPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>

            {/* Password Strength Bar */}
            {showStrengthBar && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                <div
                  style={{
                    height: "6px",
                    flex: 1,
                    borderRadius: "3px",
                    backgroundColor: "#eee",
                    marginRight: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      height: "100%",
                      backgroundColor: passwordStrength.color,
                      transition: "width 0.3s",
                    }}
                  ></div>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "500", color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}

            {/* Confirm New Password */}
            <div style={{ position: "relative", marginBottom: "20px" }}>
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Confirm New Password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px 40px 12px 12px",
                  borderRadius: "10px",
                  border: "1px solid #ddd",
                  boxSizing: "border-box",
                }}
              />
              <img
                src={showConfirmPass ? "/eyeopen.png" : "/eyeclose.png"}
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />
            </div>
            


            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setShowPasswordModal(false)}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  marginRight: "10px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#696969",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "#ff6600",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        `}
      </style>
    </div>
  );
}

export default Profile;
