import { useState, useEffect } from "react";
import { db, auth } from "../firebase.js";
import { ref, onValue, set, remove, get } from "firebase/database";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logoutImg from "../assets/logout.png";
import emptyCartImg from "../assets/emptycart.png";

function Home({ user, userUID, total, setTotal, onLogout }) {
  const [items, setItems] = useState([]);
  const [budget, setBudget] = useState(0);
  const [showBudget, setShowBudget] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [productsCache, setProductsCache] = useState({}); // <-- Cache all products

  const navigate = useNavigate();

  // Add these states at the top
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);

  // Update total including discount
  const totalWithDiscount = Math.max(total - discount, 0);


  // --- Load all products once and cache ---
  useEffect(() => {
    const productsRef = ref(db, "products");
    get(productsRef).then((snapshot) => {
      if (snapshot.exists()) {
        setProductsCache(snapshot.val());
      }
    });
  }, []);

  // --- Listen to user's cart ---
  useEffect(() => {
    if (!userUID) return;

    setLoading(true);
    const cartRef = ref(db, `cart/${userUID}`);
    const unsubscribe = onValue(cartRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const arr = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setItems(arr);
        setTotal(arr.reduce((sum, item) => sum + item.price, 0));
      } else {
        setItems([]);
        setTotal(0);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userUID, setTotal]);

  // --- Listen to scanned tags from ESP32 (instant lookup using cache) ---
  useEffect(() => {
    if (!userUID) return;

    const tagsRef = ref(db, `tags/${userUID}`);
    const unsubscribe = onValue(tagsRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      setLoading(true);

      for (const tagID of Object.keys(data)) {
        // Use cached product
        const product = productsCache[tagID];
        if (!product) continue;

        // Write to cart and remove tag
        await set(ref(db, `cart/${userUID}/${tagID}`), product);
        await remove(ref(db, `tags/${userUID}/${tagID}`));
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [userUID, productsCache]);

  // --- Load budget from Firebase on mount ---
  useEffect(() => {
    if (!userUID) return;

    const budgetRef = ref(db, `users/${userUID}/budget`);
    const unsubscribe = onValue(budgetRef, (snapshot) => {
      const savedBudget = snapshot.val();
      if (savedBudget !== null) setBudget(savedBudget);
    });

    return () => unsubscribe();
  }, [userUID]);

  // --- Remove item ---
  const removeItem = async (index) => {
    const itemToRemove = items[index];
    if (!itemToRemove?.id || !userUID) return;
    setLoading(true);
    await remove(ref(db, `cart/${userUID}/${itemToRemove.id}`));
    setLoading(false);
  };

  // --- Save budget ---
  const saveBudget = async () => {
    if (!userUID) return;
    setLoading(true);
    await set(ref(db, `users/${userUID}/budget`), budget);
    setShowBudget(false);
    setLoading(false);
  };

  // --- Handle Pay ---
  const handlePay = () => {
    if (items.length === 0) {
      setWarningMessage("Your cart is empty!\nAdd items before paying.");
      setShowWarning(true);
      return;
    }

    if (budget > 0 && total > budget) {
      setWarningMessage("Budget exceeded!\nRemove items or adjust your limit.");
      setShowWarning(true);
      return;
    }

    setShowWarning(false); 
    navigate("/payment");
  };

  // --- Logout ---
  const handleLogout = async () => {
    setLoading(true);
    await signOut(auth);
    onLogout();
    setLoading(false);
  };

  // --- Modal button style ---
  const modalButtonStyle = {
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#ff9800",
    color: "white",
    border: "none",
    cursor: "pointer",
    transition: "all 0.25s ease",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f6f7fb", padding: "25px", position: "relative" }}>
      {/* Spinner */}
      {loading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #fff",
              borderTop: "5px solid #ff6600",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ color: "#000", fontSize: "18px" }}>Hi, {user}!</h2>
        <button onClick={handleLogout} style={{ width: "38px", height: "38px", border: "none", background: "transparent", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={logoutImg} alt="Logout" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </button>
      </div>

      {/* Items list */}
      <div style={{ marginTop: "20px", padding: "20px", borderRadius: "20px", backgroundColor: "white", minHeight: "220px", boxShadow: "0 10px 25px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", justifyContent: items.length === 0 ? "center" : "flex-start", alignItems: "center" }}>
        {items.length === 0 ? (
          <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <div style={{ marginLeft: "0px", marginBottom: "-10px" }}>
              <img src={emptyCartImg} alt="Empty cart" style={{ width: "90px", height: "90px", objectFit: "contain", opacity: 0.4 }} />
            </div>
            <p style={{ color: "#999", fontSize: "16px", textAlign: "center" }}>
              Your cart is empty... C'mon let's shop!
            </p>
          </div>
        ) : (
          items.map((item, i) => (
            <div key={i} style={{ width: "100%", padding: "14px", marginBottom: "10px", borderRadius: "12px", background: "#fff5eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{item.name}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>RM {item.price}</span>
                <img src="/trash.png" alt="Remove" onClick={() => removeItem(i)} style={{ width: "22px", height: "22px", cursor: "pointer" }} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Budget & Pay */}
      <div style={{ marginTop: "25px", display: "flex", gap: "15px" }}>
        <button onClick={() => setShowBudget(true)} style={{ flex: 1, padding: "14px", borderRadius: "14px", backgroundColor: "white", color: "#ff6600", border: "2px solid #ff9800", cursor: "pointer" }}>
          Set Budget Limit
        </button>
        <button onClick={handlePay} style={{ flex: 1, padding: "14px", borderRadius: "14px", background: "linear-gradient(135deg, #ff6600, #ff8c00)", color: "white", border: "none", cursor: "pointer" }}>
          Pay
        </button>
      </div>

      {/* Total */}
      <div
        style={{
          marginTop: "30px",
          backgroundColor: "white",
          padding: "12px 20px",
          borderRadius: "18px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "16px", color: "#555", fontWeight: "bold" }}>Total Price</span>
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>RM {total.toFixed(2)}</span>
      </div>

      {/* Budget modal */}
      {showBudget && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "20px", width: "280px", textAlign: "center" }}>
            <h3>What's Your Budget?</h3>
            <input
              type="number"
              placeholder="Enter your amount"
              value={budget === 0 ? "" : budget}
              onChange={(e) => setBudget(e.target.value === "" ? 0 : Number(e.target.value))}
              style={{ width: "90%", padding: "12px", marginTop: "10px", borderRadius: "10px", border: "1px solid #ddd" }}
            />
            <button onClick={saveBudget} style={modalButtonStyle}>Okay</button>
          </div>
        </div>
      )}

      {/* Warning modal */}
      {showWarning && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ backgroundColor: "white", padding: "25px", borderRadius: "20px", width: "300px", textAlign: "center" }}>
            <h3 style={{ color: "#D0342C" }}>Attention!</h3>
            <p style={{ marginTop: "10px", color: "#555", whiteSpace: "pre-line" }}>{warningMessage}</p>
            <button onClick={() => setShowWarning(false)} style={modalButtonStyle}>Okay</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
