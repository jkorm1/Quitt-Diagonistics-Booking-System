"use client";

import { createContext, useContext, useState, useEffect } from "react";

export type UserType = "admin" | "frontdesk" | "patient" | null;

interface User {
  id: string;
  name: string;
  email: string;
  type: UserType;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  userType: UserType;
  isLoading: boolean;
  login: (username: string, password: string, type: UserType) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("auth_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setUserType(parsed.type);
      } catch (e) {
        console.error("[v0] Error parsing stored auth:", e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, type: UserType) => {
    // In production, this would call an API endpoint
    // For now, we'll use a simple authentication check
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, type }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Authentication failed");
      }

      const userData = await response.json();

      const mockUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        type: type,
        role: userData.role,
      };

      setUser(mockUser);
      setUserType(type);
      localStorage.setItem("auth_user", JSON.stringify(mockUser));
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Authentication failed",
      );
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userType,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
