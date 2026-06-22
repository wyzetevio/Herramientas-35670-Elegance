import { createContext, useState, useEffect } from "react";
import { getProfile } from "../Services/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;

      try {
        const res = await getProfile();
        setUser(res.data);
      } catch (error) {
        logout();
      }
    };

    fetchUser();
  }, [token]);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};