import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase.js"
import { ref, onValue, remove, set } from "firebase/database"
import Receipt from "../components/Receipt"

import visa from "../assets/visa.png"
import mastercard from "../assets/mastercard.png"
import tng from "../assets/tng.png"
import grabpay from "../assets/grabpay.png"
import shopeepay from "../assets/shopeepay.png"
import fpx from "../assets/fpx.png"

function Payment({ userUID }) {
  const navigate = useNavigate()

  const [selected, setSelected] = useState("")
  const [showWarning, setShowWarning] = useState(false)
  const [showReceipt, setShowReceipt] = useState(false)
  const [hoverPay, setHoverPay] = useState(false)

  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)

  const paymentMethods = [
    { name: "Credit/Debit Card", logos: [visa, mastercard] },
    { name: "E-Wallet", logos: [tng, grabpay, shopeepay] },
    { name: "Online Banking", logos: [fpx] },
  ]

  // --- Load user's cart ---
  useEffect(() => {
    if (!userUID) return

    const cartRef = ref(db, `cart/${userUID}`)
    const unsubscribe = onValue(cartRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }))
        setCartItems(arr)
        setTotalPrice(arr.reduce((sum, item) => sum + item.price, 0))
      } else {
        setCartItems([])
        setTotalPrice(0)
      }
    })

    return () => unsubscribe()
  }, [userUID])

  // --- Confirm payment ---
  const handleConfirm = () => {
    if (!selected) {
      setShowWarning(true)
      return
    }
    setShowReceipt(true)
  }

  // --- Close receipt and save transaction to history ---
  const handleCloseReceipt = async () => {
    if (userUID) {
      const timestamp = Date.now()
      const dateObj = new Date(timestamp)
      const day = dateObj.toLocaleDateString("en-US", { weekday: "long" })
      const date = dateObj.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
      const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const transaction = {
        method: selected || "Unknown",
        amount: totalPrice,
        timestamp,
        day,
        date,
        time,
        items: cartItems, // store items in history too
      }

      await set(ref(db, `history/${userUID}/${timestamp}`), transaction)
      await remove(ref(db, `cart/${userUID}`))
    }

    setShowReceipt(false)
    navigate("/")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: "25px" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Checkout</h2>

      {/* Total amount */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          marginBottom: "30px",
        }}
      >
        <div style={{ fontSize: "13px", color: "#777", marginBottom: "2px" }}>
          Total Payable Amount
        </div>
        <div style={{ fontSize: "26px", fontWeight: "600", marginTop: "2px" }}>
          RM {totalPrice.toFixed(2)}
        </div>
      </div>

      {/* Payment methods */}
      <h3 style={{ fontSize: "16px", marginBottom: "15px" }}>Select Payment Method</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {paymentMethods.map((method, index) => (
          <div
            key={index}
            onClick={() => {
              setSelected(method.name)
              setShowWarning(false)
            }}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "16px",
              borderRadius: "16px",
              background: "#fff",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
              cursor: "pointer",
              border: selected === method.name ? "2px solid #ff6600" : "2px solid transparent",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                marginRight: "14px",
                border: "2px solid #ff6600",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected === method.name && (
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff9800, #ff5722)",
                  }}
                />
              )}
            </div>
            <div style={{ flex: 1, fontSize: "15px" }}>{method.name}</div>
            <div style={{ display: "flex", gap: "10px" }}>
              {method.logos.map((logo, i) => (
                <img key={i} src={logo} alt="" style={{ height: "22px", objectFit: "contain" }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showWarning && (
        <div
          style={{
            marginTop: "15px",
            padding: "12px",
            backgroundColor: "#ffccbc",
            color: "#d84315",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          Please select a payment method
        </div>
      )}

      <button
        onClick={handleConfirm}
        onMouseEnter={() => setHoverPay(true)}
        onMouseLeave={() => setHoverPay(false)}
        style={{
          marginTop: "32px",
          width: "100%",
          padding: "16px",
          borderRadius: "18px",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "500",
          color: "#fff",
          background: hoverPay
            ? "linear-gradient(135deg, #ff5722, #ff9800)"
            : "linear-gradient(135deg, #ff9800, #ff5722)",
          transition: "all 0.25s ease",
          boxShadow: hoverPay
            ? "0 8px 20px rgba(255,102,0,0.4)"
            : "0 6px 15px rgba(255,102,0,0.3)",
        }}
      >
        Pay RM {totalPrice.toFixed(2)}
      </button>

      {/* Receipt modal */}
      <Receipt
        isOpen={showReceipt}
        onClose={handleCloseReceipt}
        cartItems={cartItems}
        totalPrice={totalPrice}
        paymentMethod={selected} // <-- pass selected payment method
      />
    </div>
  )
}

export default Payment
