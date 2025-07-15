import { useState, useEffect, createContext } from "react";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const url = "http://localhost:8001";

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <StoreContext.Provider value={{ token, setToken, url }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
