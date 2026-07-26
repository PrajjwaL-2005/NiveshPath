import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [virtualBalance, setVirtualBalance] = useState(
    storedUser?.user?.virtualBalance ?? null
  );

  const login = (data) => {
    const { password, ...safeUser } = data.user ?? {};
    const sanitized = { ...data, user: safeUser };
    localStorage.setItem("user", JSON.stringify(sanitized));
    setUser(sanitized);
    setVirtualBalance(safeUser.virtualBalance ?? data.virtualBalance);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setVirtualBalance(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        virtualBalance,
        setVirtualBalance,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
