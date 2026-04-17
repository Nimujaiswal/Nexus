import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("nexus_user");
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  });

  const login = (email, password) => {
    // Simulate login — accept any valid-looking credentials
    if (!email || !password || password.length < 6) {
      throw new Error("Invalid email or password.");
    }
    const u = { id: Date.now(), username: email.split("@")[0], email };
    localStorage.setItem("nexus_user", JSON.stringify(u));
    setUser(u);
  };

  const register = (username, email, password) => {
    if (!username || !email || !password || password.length < 6) {
      throw new Error("All fields required. Password min 6 chars.");
    }
    const u = { id: Date.now(), username, email };
    localStorage.setItem("nexus_user", JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem("nexus_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
