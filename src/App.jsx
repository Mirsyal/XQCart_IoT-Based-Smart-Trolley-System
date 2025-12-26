import { useState } from "react"
import Launch from "./components/Launch"
import Login from "./components/Login"
import Home from "./components/Home"
import Payment from "./components/Payment"

function App() {
  const [page, setPage] = useState("launch") // which screen is shown
  const [user, setUser] = useState("")       // username
  const [total, setTotal] = useState(0)      // total price

  return (
    <>
      {page === "launch" && <Launch onNext={() => setPage("login")} />}
      {page === "login" && <Login onLogin={(name) => {
        setUser(name)
        setPage("home")
      }} />}
      {page === "home" && <Home
        user={user}
        total={total}
        setTotal={setTotal}
        onPay={() => setPage("payment")}
      />}
      {page === "payment" && <Payment onDone={() => {
        setPage("home")
      }} />}
    </>
  )
}

export default App
