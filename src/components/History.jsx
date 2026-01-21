import { useState, useEffect } from "react"
import { db } from "../firebase.js"
import { ref, onValue } from "firebase/database"
import emptyHistoryImg from "../assets/NoHistory.png"
import Receipt from "../components/Receipt"

function History({ userUID }) {
  const [history, setHistory] = useState([])
  const [showReceipt, setShowReceipt] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  // --- Fetch history from Firebase ---
  useEffect(() => {
    if (!userUID) return

    const historyRef = ref(db, `history/${userUID}`)
    const unsubscribe = onValue(historyRef, snapshot => {
      const data = snapshot.val()
      if (data) {
        const arr = Object.keys(data).map(key => ({ id: key, ...data[key] }))
        setHistory(arr.sort((a, b) => b.timestamp - a.timestamp))
      } else {
        setHistory([])
      }
    })

    return () => unsubscribe()
  }, [userUID])

  const handleOpenReceipt = (transaction) => {
    setSelectedTransaction(transaction)
    setShowReceipt(true)
  }

  const handleCloseReceipt = () => {
    setShowReceipt(false)
    setSelectedTransaction(null)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f6fa", padding: "24px" }}>
      <h2 style={{ fontSize: "22px", marginBottom: "20px", color: "#111" }}>Purchase History</h2>

      {history.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "50px 20px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={emptyHistoryImg}
            alt="No purchases"
            style={{ width: "70px", marginBottom: "12px", opacity: 0.35, transform: "translateX(-5px)" }}
          />
          <div style={{ fontSize: "14px", color: "#888" }}>No purchases made yet.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {history.map(item => (
            <div
              key={item.id}
              onClick={() => handleOpenReceipt(item)}
              style={{
                background: "#fff",
                padding: "16px 18px",
                borderRadius: "18px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "15px", fontWeight: 600, color: "#222" }}>{item.method || "Purchase"}</span>
                <span style={{ fontSize: "12px", color: "#777" }}>
                  {item.day}, {item.date} • {item.time}
                </span>
              </div>

              <div style={{ fontSize: "15px", fontWeight: 600, color: "#800020" }}>
                RM {item.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Receipt popup */}
      {selectedTransaction && (
        <Receipt
          isOpen={showReceipt}
          onClose={handleCloseReceipt}
          cartItems={selectedTransaction.items || []}
          totalPrice={selectedTransaction.amount || 0}        // already discounted
          paymentMethod={selectedTransaction.method || "Unknown"}
          voucherCode={selectedTransaction.voucher || null}   // voucher used
          discountAmount={selectedTransaction.discount || 0}   // voucher value
          day={selectedTransaction.day}
          date={selectedTransaction.date}
          time={selectedTransaction.time}
        />
      )}
    </div>
  )
}

export default History
