"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { UserDto } from "@/types";


interface AuthContextType {
    user: UserDto | null,
    setAuthUser: (user: UserDto) => void,
    clearAuthUser: () => void,
    isAuthenticated: () => boolean,
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<UserDto | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null; 
    });

    const setAuthUser = (userData: UserDto) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const clearAuthUser = () => {
        setUser(null);
        localStorage.removeItem("user")
    };

    const isAuthenticated = (): boolean => {
        return !!user;
    }

    return <AuthContext.Provider value={{ user, setAuthUser, clearAuthUser, isAuthenticated }}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}