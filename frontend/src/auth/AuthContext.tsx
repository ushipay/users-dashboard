import { createContext, useContext, useState } from "react";

type AuthContextType = {
    accessToken: string | null,
    login: (token: string) => void,
    logout: () => void,
    isAuthenticated: boolean,
}

const AuthContext = createContext<AuthContextType | undefined> (undefined)

export const AuthProvider = ({children}: {children: React.ReactNode}) => {
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem("access_token")
    );
    const login = (newToken: string) => {
        localStorage.setItem("access_token", newToken);
        setAccessToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider value={{accessToken, login, logout, isAuthenticated:!!accessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used withn AuthProvider");
    return ctx;
}