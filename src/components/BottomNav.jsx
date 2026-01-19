import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// import your images
import homeIcon from "../assets/home.png";
import historyIcon from "../assets/history.png";
import profileIcon from "../assets/settings.png";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("/");

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const navItems = [
    { path: "/", icon: homeIcon },
    { path: "/history", icon: historyIcon },
    { path: "/settings", icon: profileIcon },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        background: "#fff",
        borderTop: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-around",
        padding: "10px 0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      {navItems.map((item) => {
        const isActive = active === item.path;
        return (
          <div
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <img
              src={item.icon}
              alt=""
              style={{
                width: "28px",
                height: "28px",
                filter: isActive
                  ? "drop-shadow(0 2px 4px rgba(255,102,0,0.6))"
                  : "none",
                transition: "all 0.2s ease",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default BottomNav;
