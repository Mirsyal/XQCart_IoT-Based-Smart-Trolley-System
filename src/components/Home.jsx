import { useState } from "react"

function Home({ user, total, setTotal, onPay }) {
  const dummyItems = [
    { name: "Milk", price: 6 },
    { name: "Bread", price: 3 },
    { name: "Eggs", price: 8 }
  ]

  const [items, setItems] = useState([])
  const [removedItems, setRemovedItems] = useState([])
  const [budget, setBudget] = useState(0)
  const [showBudget, setShowBudget] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  // Add items with delay
  const addItem = () => {
  const itemsToAdd = removedItems.length > 0 ? removedItems : dummyItems
  itemsToAdd.forEach((item, i) => {
    setTimeout(() => {
      setItems(prevItems => {
        const updatedItems = [...prevItems, item]
        setTotal(updatedItems.reduce((sum, it) => sum + it.price, 0))
        return updatedItems
      })
    }, (i + 1) * 500) // reduce delay if needed
  })
  setRemovedItems([])
}


  // Handle pay with budget check
  const handlePay = () => {
    if (budget > 0 && total > budget) {
      setShowWarning(true)
      return
    }
    onPay()
  }

  // Remove item
  const removeItem = (index) => {
    const removed = items[index]
    setItems(prev => prev.filter((_, i) => i !== index))
    setRemovedItems(prev => [...prev, removed])

    const newTotal = items
      .filter((_, i) => i !== index)
      .reduce((sum, it) => sum + it.price, 0)
    setTotal(newTotal)
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: "25px" }}>
      <h2 style={{ color: "#000000", fontSize: "18px"}}>
        Hi, {user}!
      </h2>

      {/* Items card */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          borderRadius: "20px",
          backgroundColor: "white",
          minHeight: "220px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: items.length === 0 ? "center" : "flex-start",
          alignItems: "center"
        }}
      >
        {items.length === 0 ? (
          <p style={{ color: "#999", fontSize: "16px" }}>Nothing yet!</p>
        ) : (
          items.map((item, i) => (
            <div
              key={i}
              style={{
                width: "100%",
                padding: "14px",
                marginBottom: "10px",
                borderRadius: "12px",
                background: "#fff5eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative"
              }}
            >
              <span>{item.name}</span>

              {/* Right side: price + trash icon */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>RM {item.price}</span>
                <img
                  src="/trash.png" // put your trash image in public folder
                  alt="Remove"
                  onClick={() => removeItem(i)}
                  style={{ width: "22px", height: "22px", cursor: "pointer" }}
                />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Buttons */}
      <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
        <button
          onClick={addItem}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            backgroundColor: "#ff9800",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Update
        </button>

        <button
          onClick={() => setShowBudget(true)}
          style={{
            flex: 1,
            padding: "14px",
            borderRadius: "14px",
            backgroundColor: "white",
            color: "#ff6600",
            border: "2px solid #ff9800",
            cursor: "pointer"
          }}
        >
          Set Budget Limit
        </button>
      </div>

      {/* Total & Pay */}
      <div
        style={{
          marginTop: "30px",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "18px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        <h3>Total RM {total}</h3>

        <button
          onClick={handlePay}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "14px",
            borderRadius: "14px",
            backgroundColor: "#ff6600",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Pay
        </button>
      </div>

      {/* Budget modal */}
      {showBudget && (
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
              width: "280px"
            }}
          >
            <h3>Set Budget</h3>

            <input
              type="number"
              placeholder="Enter your amount"
              value={budget === 0 ? "" : budget} // show empty if 0
              onChange={(e) => setBudget(e.target.value === "" ? 0 : Number(e.target.value))}
              style={{
                width: "90%",
                padding: "12px",
                marginTop: "10px",
                borderRadius: "10px",
                border: "1px solid #ddd"
              }}
            />

            <button
              onClick={() => setShowBudget(false)}
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
              Okay
            </button>
          </div>
        </div>
      )}

      {/* Budget exceeded warning */}
      {showWarning && (
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
              width: "300px",
              textAlign: "center"
            }}
          >
            <h3 style={{ color: "#ff5722" }}>Budget Exceeded!</h3>
            <p style={{ marginTop: "10px", color: "#555" }}>
              Please remove items or increase your budget limit to proceed.
            </p>

            <button
              onClick={() => setShowWarning(false)}
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
              Okay
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
