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
        background: "linear-gradient(135deg, #ff9800, #ff5722)",
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

        @keyframes scaleIn {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "300px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          textAlign: "center",
          boxSizing: "border-box",
          animation: "scaleIn 0.6s ease-out"
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
            marginBottom: "10px",
            letterSpacing: "1px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
          }}
        >
          XQCart
        </h2>

        <p
          style={{
            fontSize: "14px",
            marginBottom: "25px",
            color: "#000000"
          }}
        >
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
            maxWidth: "260px",
            padding: "8px",
            borderRadius: "12px",
            fontSize: "15px",
            backgroundColor: hover ? "#ff8c00" : "orange",
            transform: pressed
              ? "scale(0.95)"
              : hover
              ? "scale(1.05)"
              : "scale(1)",
            transition: "all 0.15s ease",
            boxShadow: hover
              ? "0 5px 15px rgba(0,0,0,0.3)"
              : "0 3px 10px rgba(0,0,0,0.25)",
            cursor: "pointer"
          }}
        >
          Let's Begin!
        </button>
      </div>
    </div>
  )
}

export default Launch
