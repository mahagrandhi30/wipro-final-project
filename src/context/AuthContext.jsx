import React, { createContext, useContext, useState, useEffect } from "react";
import { api, setAuthToken } from "../services/api.js";
import { jwtDecode } from "jwt-decode"; // ✅ fixed import

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        setAuthToken(token);
        const decoded = jwtDecode(token); // ✅ works now
        setUser({
          id: decoded.id,
          name: decoded.name,
          email: decoded.sub,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Failed to decode token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/users/login", { email, password });
      const { token, id, name, email: userEmail, role } = res.data;
      localStorage.setItem("token", token);
      setAuthToken(token);
      setUser({ id, name, email: userEmail, role });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const register = async ({ name, email, password }) => {
    setLoading(true);
    try {
      await api.post("/users/register", {
        name,
        email,
        password,
        role, // from caller
      });
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err.response?.data || "Registration failed" };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
