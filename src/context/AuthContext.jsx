import { createContext, useContext, useState } from "react";
import {
    getToken,
    getUser,
    saveAuth,
    clearAuth,
    logout as logoutService
} from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [token, setToken] = useState(getToken());
    const [user, setUser] = useState(getUser());

    const login = (data) => {

        saveAuth(data.token, data.user);

        setToken(data.token);
        setUser(data.user);
    };

    const logout = async () => {

        try {
            await logoutService();
        } finally {
            clearAuth();

            setToken(null);
            setUser(null);
        }
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}