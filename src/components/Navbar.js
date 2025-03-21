"use client";

import { useEffect, useState } from "react";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/auth/session");
        
        if (!res.ok) throw new Error("Failed to fetch session");

        const data = await res.json();
        
        if (data && data.email) {
          setUser(data);
        } else {
          setUser(null); // ✅ Ensure user state is correctly handled
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  return (
    <nav style={{ display: "flex", justifyContent: "space-between", padding: "10px", background: "#333", color: "white" }}>
      <h1>My App</h1>
      <div>{user && user.name}</div>
      <div>
        {user ? (
          <LogoutLink style={{ padding: "10px", background: "red", borderRadius: "5px", cursor: "pointer" }}>
            Logout
          </LogoutLink>
        ) : (
          <LoginLink style={{ padding: "10px", background: "blue", borderRadius: "5px", cursor: "pointer" }}>
            Login
          </LoginLink>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
