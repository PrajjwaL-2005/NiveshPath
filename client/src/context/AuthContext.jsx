import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(storedUser);
  const [virtualBalance, setVirtualBalance] = useState(
    storedUser?.virtualBalance ?? null
  );

  const login = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
    setVirtualBalance(data.virtualBalance); // ✅ sync balance on login
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
