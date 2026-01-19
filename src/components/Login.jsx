import { useState } from "react"
import { db, auth } from "../firebase.js"
import { ref, set, get } from "firebase/database"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth"

function Login({ onLogin }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [hover, setHover] = useState(false)
  const [hoverLink, setHoverLink] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setError("")
    setLoading(true)
    try {
      if (isRegister) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        await set(ref(db, "users/" + user.uid), { username, email })
        onLogin(username)
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user
        const snapshot = await get(ref(db, "users/" + user.uid))
        if (snapshot.exists()) {
          const data = snapshot.val()
          onLogin(data.username)
        } else {
          onLogin(user.email)
        }
      }
    } catch {
      setError("Invalid login or account does not exist!")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    maxWidth: "260px",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxSizing: "border-box"
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff9800, #ff5722)",
        position: "relative",
        padding: "10px",
        boxSizing: "border-box"
      }}
    >
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }

        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 rgba(255,165,0,0.4); }
          50% { box-shadow: 0 0 18px rgba(255,165,0,0.8); }
          100% { box-shadow: 0 0 0 rgba(255,165,0,0.4); }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #fff",
              borderTop: "4px solid #ff6600",
              borderRadius: "50%",
              animation: "spin 1s linear infinite"
            }}
          />
        </div>
      )}

      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          boxSizing: "border-box",
          textAlign: "center",
          position: "relative",
          zIndex: 1
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            border: "5px solid orange",
            margin: "20px auto 14px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            animation: "float 2.5s ease-in-out infinite, pulseGlow 2s ease-in-out infinite",
            backgroundColor: "white"
          }}
        >
          <img
            src="/xqcart_icon.png"
            alt="XQCart Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>

        <h2
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: "28px",
            fontWeight: 700,
            color: "#ff6600",
            marginBottom: "15px",
            letterSpacing: "1px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}
        >
          XQCart
        </h2>

        <p style={{ fontSize: "14px", marginBottom: "15px" }}>
          Smart Trolley System
        </p>

        {isRegister && (
          <input
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={inputStyle}
          />
        )}

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <div style={{ position: "relative", width: "100%", maxWidth: "260px", margin: "0 auto 8px auto" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ ...inputStyle, paddingRight: "35px" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "8px",
              top: "48%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center"
            }}
          >
            <img
              src={showPassword ? "/eyeopen.png" : "/eyeclose.png"}
              alt="toggle"
              style={{ width: "16px", height: "16px" }}
            />
          </span>
        </div>

        {error && (
          <p style={{ color: "red", fontSize: "13px", marginBottom: "8px" }}>
            {error}
          </p>
        )}

        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => { setHover(false); setPressed(false) }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => { setPressed(false); handleSubmit() }}
          disabled={loading}
          style={{
            width: "100%",
            maxWidth: "260px",
            padding: "8px",
            borderRadius: "12px",
            fontSize: "15px",
            backgroundColor: hover ? "#ff8c00" : "orange",
            opacity: loading ? 0.6 : 1,
            transform: pressed ? "scale(0.95)" : hover ? "scale(1.05)" : "scale(1)",
            transition: "all 0.15s ease",
            boxShadow: hover ? "0 5px 15px rgba(0,0,0,0.3)" : "0 3px 10px rgba(0,0,0,0.25)",
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {isRegister ? "Register" : "Login"}
        </button>

        <p
          onMouseEnter={() => setHoverLink(true)}
          onMouseLeave={() => setHoverLink(false)}
          onClick={() => { setIsRegister(!isRegister); setError("") }}
          style={{
            fontSize: "12px",
            marginTop: "12px",
            color: "#888",
            cursor: "pointer",
            textDecoration: hoverLink ? "underline" : "none",
            transition: "text-decoration 0.2s ease"
          }}
        >
          {isRegister ? "Already have an account? Login" : "Register here"}
        </p>
      </div>
    </div>
  )
}

export default Login
