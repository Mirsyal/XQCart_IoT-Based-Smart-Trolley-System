import { useState } from "react"

function Login({ onLogin }) {
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [hover, setHover] = useState(false)
  const [pressed, setPressed] = useState(false)

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #ff9800, #ff5722)"
      }}
    >
      <div
        style={{
          width: "320px",
          backgroundColor: "white",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
        }}
      >
        <div
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
            backgroundColor: "orange",
            margin: "0 auto 20px auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            color: "white"
          }}
        >
          🛒
        </div>

        <h2 style={{ textAlign: "center", fontSize: "32px", color: "#ff6600", marginBottom: "25px" }}>
          XQCart
        </h2>

        <p
          style={{
            textAlign: "center",
            color: "#000000",
            fontSize: "16px",
            marginTop: "-8px",
            marginBottom: "25px"
          }}
        >
          Smart Trolley System
        </p>

        <input
        placeholder="Username"
        onChange={(e) => setName(e.target.value)}
        style={{
          width: "107%",
          padding: "12px",
          marginBottom: "12px",
          borderRadius: "10px",
          border: "1px solid #ddd",
          boxSizing: "border-box"
          }}
        />

        <input
          placeholder="Email"
          style={{
            marginBottom: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd"
          }}
        />

        <div style={{ position: "relative", marginBottom: "20px" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            style={{
              width: "91%",
              borderRadius: "10px",
              border: "2px solid #ddd",
              paddingRight: "40px"
            }}
          />
        </div>

        {/* Login button */}
        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false)
            setPressed(false)
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => {
            setPressed(false)
            onLogin(name)
          }}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "16px",
            backgroundColor: hover ? "#ff8c00" : "orange",
            transform: pressed
              ? "scale(0.95)"
              : hover
              ? "scale(1.05)"
              : "scale(1)",
            transition: "all 0.15s ease",
            boxShadow: hover
              ? "0 8px 20px rgba(0,0,0,0.3)"
              : "0 6px 15px rgba(0,0,0,0.25)"
          }}
        >
          Login
        </button>

        <p
          style={{
            textAlign: "center",
            fontSize: "13px",
            marginTop: "20px",
            color: "#888"
          }}
        >
          Register here
        </p>
      </div>
    </div>
  )
}

export default Login