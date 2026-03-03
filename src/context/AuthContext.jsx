import { createContext, useEffect, useState } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchUser() {
    try {
      const res = await api.get("auth/user/");
      setUser(res.data);
    } catch (err) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  if (localStorage.getItem("access")) {
    fetchUser();
  } else {
    setLoading(false);
  }
}, []);


    
  function logout() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
