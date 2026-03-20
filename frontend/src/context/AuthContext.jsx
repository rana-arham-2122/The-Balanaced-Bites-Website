import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../api/services";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // Restore session on page load
  useEffect(() => {
    const restore = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) { setLoading(false); return; }
      try {
        const { user } = await authAPI.getProfile();
        setUser(user);
      } catch {
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await authAPI.register(name, email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg); throw new Error(msg);
    }
  };

  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authAPI.login(email, password);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg); throw new Error(msg);
    }
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const data = await authAPI.updateProfile(profileData);
      setUser(data.user);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || "Update failed.";
      setError(msg); throw new Error(msg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout, updateProfile, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
