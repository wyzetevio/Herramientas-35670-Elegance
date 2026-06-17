import { createContext, useState, useEffect } from "react";
import { getProfile } from "../Services/Api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);

    useEffect(() => {
        const fetchUser = async () => {
            if (token) {
                try {
                    const res = await getProfile(token);
                    setUser(res.data);
                } catch (error) {
                    console.error("Error al obtener perfil:", error);
                    logout();
                }
            }
        };
        fetchUser();
    }, [token]);

    const login = (data) => {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
