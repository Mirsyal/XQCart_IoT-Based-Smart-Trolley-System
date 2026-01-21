import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../firebase.js"
import { ref, onValue, remove, set, get, update } from "firebase/database"
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
  const [discountedPrice, setDiscountedPrice] = useState(0)

  const [voucherCode, setVoucherCode] = useState("")
  const [voucherApplied, setVoucherApplied] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success") // "success" or "error"

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
        const total = arr.reduce((sum, item) => sum + item.price, 0)
        setTotalPrice(total)
        setDiscountedPrice(total) // reset discounted price
        setVoucherApplied(false)
        setVoucherCode("")
      } else {
        setCartItems([])
        setTotalPrice(0)
        setDiscountedPrice(0)
      }
    })

    return () => unsubscribe()
  }, [userUID])

  // --- Apply voucher ---
  const handleApplyVoucher = async () => {
    if (!voucherCode) return

    const code = voucherCode.toLowerCase() // make lowercase to match Firebase
    const voucherRef = ref(db, `vouchers/${code}`)
    const snapshot = await get(voucherRef)

    if (snapshot.exists()) {
      const voucherData = snapshot.val()

      if (voucherData.usedBy && voucherData.usedBy[userUID]) {
        setToastType("error")
        setToastMessage("Voucher already used")
        setTimeout(() => setToastMessage(""), 3000)
        return
      }

      // Deduct voucher amount
      const discountAmount = voucherData.amount || 0
      setDiscountedPrice(prev => Math.max(prev - discountAmount, 0))
      setVoucherApplied(true)

      // Mark voucher as used by this user
      await update(voucherRef, {
        usedBy: { ...(voucherData.usedBy || {}), [userUID]: true }
      })

      setToastType("success")
      setToastMessage("Voucher applied successfully!")
      setTimeout(() => setToastMessage(""), 3000)
    } else {
      setToastType("error")
      setToastMessage("Invalid voucher code")
      setTimeout(() => setToastMessage(""), 3000)
    }
  }

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
      const date = dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      const time = dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

      const transaction = {
        method: selected || "Unknown",
        amount: discountedPrice,
        timestamp,
        day,
        date,
        time,
        items: cartItems,
        voucher: voucherApplied ? voucherCode : null,
        discount: voucherApplied ? totalPrice - discountedPrice : 0
      }

      await set(ref(db, `history/${userUID}/${timestamp}`), transaction)
      await remove(ref(db, `cart/${userUID}`))
    }

    setShowReceipt(false)
    navigate("/")
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: "20px" }}>
      <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>Checkout</h2>

      {/* Total amount */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
          marginBottom: "15px",
        }}
      >
        <div style={{ fontSize: "13px", color: "#777", marginBottom: "2px" }}>Total Payable Amount</div>
        <div style={{ fontSize: "26px", fontWeight: "600", marginTop: "2px" }}>RM {discountedPrice.toFixed(2)}</div>
      </div>

      {/* Voucher input */}
      <div style={{ position: "relative", marginBottom: "20px", width: "100%", maxWidth: "360px" }}>
        <input
          type="text"
          value={voucherCode}
          onChange={e => setVoucherCode(e.target.value)}
          placeholder="Voucher code"
          disabled={voucherApplied}
          style={{
            width: "100%",
            padding: "12px 100px 12px 12px",
            borderRadius: "12px",
            border: "1px solid #ccc",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />
        <button
          onClick={handleApplyVoucher}
          disabled={voucherApplied || !voucherCode}
          style={{
            position: "absolute",
            top: "50%",
            right: "4px",
            transform: "translateY(-50%)",
            padding: "8px 16px",
            borderRadius: "10px",
            border: "none",
            background: voucherApplied || !voucherCode ? "#ccc" : "#ff9800",
            color: "#fff",
            fontWeight: "500",
            cursor: voucherApplied || !voucherCode ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {voucherApplied ? "Applied" : "Apply"}
        </button>
      </div>

      {/* Toast messages */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: toastType === "success" ? "#4caf50" : "#f44336",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            zIndex: 1000,
            whiteSpace: "nowrap",
          }}
        >
          {toastMessage}
        </div>
      )}

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
        Pay RM {discountedPrice.toFixed(2)}
      </button>

      {/* Receipt modal */}
      <Receipt
        isOpen={showReceipt}
        onClose={handleCloseReceipt}
        cartItems={cartItems}
        totalPrice={discountedPrice}
        paymentMethod={selected}
        voucherCode={voucherApplied ? voucherCode : null}       // ✅ pass voucher
        discountAmount={voucherApplied ? totalPrice - discountedPrice : 0} // ✅ pass discount
      />
    </div>
  )
}

export default Payment
