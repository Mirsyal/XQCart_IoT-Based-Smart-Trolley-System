import { useState } from "react"

function Launch({ onNext }) {
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
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          width: "300px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            backgroundColor: "orange",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "40px",
            margin: "0 auto 20px auto"
          }}
        >
          🛒
        </div>

        <h1 style={{ margin: "10px 0", color: "#ff6600" }}>
          XQCart
        </h1>

        <p style={{ color: "#000000", marginBottom: "30px" }}>
          Smart Trolley System
        </p>

        <button
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => {
            setHover(false)
            setPressed(false)
          }}
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => {
            setPressed(false)
            onNext()
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
              ? "0 6px 15px rgba(0,0,0,0.3)"
              : "0 4px 10px rgba(0,0,0,0.2)"
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Launch