import { useState, useEffect } from "react"
import { auth, db } from "./firebase.js"
import { onAuthStateChanged } from "firebase/auth"
import { ref, set } from "firebase/database"
import Login from "./components/Login"
import Home from "./components/Home"
import Payment from "./components/Payment"
import History from "./components/History"
import Settings from "./components/Settings.jsx"
import Profile from "./components/Profile.jsx"
import Launch from "./components/Launch"
import BottomNav from "./components/BottomNav"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  const [user, setUser] = useState("")
  const [userUID, setUserUID] = useState("")
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showLaunch, setShowLaunch] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        try {
          const response = await fetch(
            `https://xqcart-iot-smart-trolley-default-rtdb.asia-southeast1.firebasedatabase.app/users/${currentUser.uid}.json`
          )
          const data = await response.json()

          setUser(data?.username || currentUser.email)
          setUserUID(currentUser.uid)

          await set(ref(db, "sessions/currentSession"), {
            uid: currentUser.uid,
          })
        } catch {
          setUser(currentUser.email)
          setUserUID(currentUser.uid)
        }
      } else {
        setUser("")
        setUserUID("")
        setTotal(0)
        await set(ref(db, "sessions/currentSession"), null)
      }

      const hasSeenLaunch = sessionStorage.getItem("hasSeenLaunch")
      setShowLaunch(!hasSeenLaunch && !currentUser)

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    setUser("")
    setUserUID("")
    setTotal(0)
    await set(ref(db, "sessions/currentSession"), null)
    await auth.signOut()
  }

  const handleLaunchNext = () => {
    sessionStorage.setItem("hasSeenLaunch", "true")
    setShowLaunch(false)
  }

  if (loading) {
    return (
      <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
        <div style={{ width: "50px", height: "50px", border: "5px solid #fff", borderTop: "5px solid #ff6600", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    )
  }

  if (showLaunch) return <Launch onNext={handleLaunchNext} />

  return (
    <Router>
      <Routes>
        {!userUID ? (
          <Route path="*" element={<Login onLogin={() => {}} />} />
        ) : (
          <>
            <Route path="/" element={<Home user={user} userUID={userUID} total={total} setTotal={setTotal} onLogout={handleLogout} />} />
            <Route path="/payment" element={<Payment userUID={userUID} />} />
            <Route path="/history" element={<History userUID={userUID} />} /> {/* Corrected route */}
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </>
        )}
      </Routes>

      {userUID && <BottomNav />}
    </Router>
  )
}

export default App
