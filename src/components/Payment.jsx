import { useState } from "react"

function Payment({ onDone }) {
  const [selected, setSelected] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const paymentMethods = ["Credit/Debit Card", "E-Wallet", "Online Banking"]

  const handleConfirm = () => {
    if (!selected) {
      setShowWarning(true)
      return
    }
    setShowPopup(true)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: "25px" }}>
      <h2 style={{ color: "#000000", marginBottom: "20px", fontSize: "18px" }}>Select Payment Method</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            onClick={() => { setSelected(method); setShowWarning(false) }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "15px",
              borderRadius: "12px",
              background: "#fff",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              cursor: "pointer",
              transition: "all 0.2s",
              border: selected === method ? "2px solid #4caf50" : "2px solid #ddd"
            }}
          >
            {/* Circle indicator */}
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "2px solid #ccc",
                marginRight: "15px",
                backgroundColor: selected === method ? "#4caf50" : "#fff",
                transition: "all 0.2s"
              }}
            />
            <span style={{ fontSize: "16px", color: "#333" }}>{method}</span>
          </div>
        ))}
      </div>

      {/* Warning card */}
      {showWarning && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            backgroundColor: "#ffccbc",
            color: "#d84315",
            borderRadius: "12px",
            textAlign: "center",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
          }}
        >
          Please select a payment method
        </div>
      )}

      {/* Confirm button */}
      <button
        onClick={handleConfirm}
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          backgroundColor: "#ff6600",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 5px 15px rgba(0,0,0,0.15)",
          transition: "all 0.2s"
        }}
        onMouseDown={(e) => (e.target.style.transform = "scale(0.97)")}
        onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
      >
        Confirm Payment
      </button>

      {/* Done popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "25px",
              borderRadius: "20px",
              width: "280px",
              textAlign: "center"
            }}
          >
            <h3 style={{ color: "#4caf50" }}>Done!</h3>
            <p style={{ marginTop: "10px", color: "#555" }}>
              Your payment has been completed successfully.
            </p>
            <button
              onClick={() => {
                setShowPopup(false)
                onDone()
              }}
              style={{
                width: "100%",
                marginTop: "15px",
                padding: "12px",
                borderRadius: "12px",
                backgroundColor: "#ff9800",
                color: "white",
                border: "none",
                cursor: "pointer"
              }}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
