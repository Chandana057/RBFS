import React, { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(() => authService.getSession());
  const user = session?.user ?? null;
  const token = session?.token ?? null;
  const isLoading = false;

  const login = async (email, password) => {
    const nextSession = await authService.login(email, password);
    setSession(nextSession);
    return nextSession.user;
  };

  const register = async (name, email, password) => {
    const nextSession = await authService.register(name, email, password);

    if (nextSession.user && nextSession.token) {
      setSession(nextSession);
    }

    return nextSession;
  };

  const logout = () => {
    authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
