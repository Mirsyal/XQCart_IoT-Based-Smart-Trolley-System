import "./Receipt.css"
import closeImg from "../assets/PopupClose.png"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { useRef } from "react"

function Receipt({
  isOpen,
  onClose,
  cartItems = [],
  totalPrice = 0,       // already final amount after voucher
  paymentMethod = "Unknown",
  voucherCode = null,   // voucher used
  discountAmount = 0,   // voucher value
  day = null,
  date = null,
  time = null,
  timestamp = null
}) {
  const pdfRef = useRef(null)

  if (!isOpen) return null

  // --- Format date/time if not provided ---
  const dateObj = timestamp ? new Date(timestamp) : new Date()
  const dayStr = day || dateObj.toLocaleDateString("en-US", { weekday: "long" })
  const dateStr = date || dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  const timeStr = time || dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const handleDownload = async () => {
    if (!pdfRef.current) return
    const canvas = await html2canvas(pdfRef.current, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const pdfWidth = 180
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, "PNG", 15, 15, pdfWidth, pdfHeight)
    pdf.save("XQCart_Receipt.pdf")
  }

  return (
    <>
      {/* Visible popup */}
      <div className="receipt-overlay">
        <div className="receipt-card">
          <button className="receipt-close" onClick={onClose}>
            <img src={closeImg} alt="Close" className="receipt-close-img" />
          </button>

          <h2 className="receipt-title">Payment Receipt</h2>
          <p className="receipt-subtitle">Thank you for shopping with XQCart</p>

          {/* Transaction info */}
          <div className="receipt-info" style={{ marginBottom: "12px", textAlign: "center" }}>
            <div style={{ fontWeight: 500 }}>{paymentMethod}</div>
            <div style={{ fontSize: "13px", color: "#777", marginTop: "2px" }}>
              {dayStr}, {dateStr} • {timeStr}
            </div>
          </div>

          {/* Itemized list */}
          <div className="receipt-list">
            {cartItems.map(item => (
              <div key={item.id} className="receipt-row">
                <span className="item-name">{item.name}</span>
                <span className="item-price">RM {item.price.toFixed(2)}</span>
              </div>
            ))}

            {/* Voucher line */}
            {voucherCode && discountAmount > 0 && (
              <div className="receipt-row">
                <span>Voucher ({voucherCode})</span>
                <span>- RM {discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="receipt-divider" />

          {/* Total */}
          <div className="receipt-total">
            <span>Final Total</span>
            <span>RM {totalPrice.toFixed(2)}</span>
          </div>

          <button className="receipt-download" onClick={handleDownload}>
            Download
          </button>
        </div>
      </div>

      {/* Hidden PDF layout */}
      <div
        ref={pdfRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "220px",
          backgroundColor: "#fff",
          color: "#000",
          padding: "12px",
          fontFamily: "monospace",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: "4px" }}>XQCart</h3>
        <p style={{ textAlign: "center", fontSize: "11px", margin: "2px 0" }}>{paymentMethod}</p>
        <p style={{ textAlign: "center", fontSize: "11px", margin: "2px 0" }}>
          {dayStr}, {dateStr} • {timeStr}
        </p>

        <hr />

        {cartItems.map(item => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12px",
              margin: "4px 0",
            }}
          >
            <span>{item.name}</span>
            <span>RM {item.price.toFixed(2)}</span>
          </div>
        ))}

        {voucherCode && discountAmount > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", margin: "4px 0" }}>
            <span>Voucher ({voucherCode})</span>
            <span>- RM {discountAmount.toFixed(2)}</span>
          </div>
        )}

        <hr />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
            fontSize: "13px",
            marginTop: "6px",
          }}
        >
          <span>Final Total</span>
          <span>RM {totalPrice.toFixed(2)}</span>
        </div>

        <p style={{ textAlign: "center", fontSize: "10px", marginTop: "8px" }}>
          Thank you for shopping with us
        </p>
      </div>
    </>
  )
}

export default Receipt
