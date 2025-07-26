// StoreContext.jsx
import { useState, useEffect, createContext } from "react";

export const StoreContext = createContext();

const StoreContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // new
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // new
  const url = "https://fitman.onrender.com";

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  // Global scroll locking logic
  useEffect(() => {
    const shouldLock = isSidebarOpen || isMobileMenuOpen;

    if (shouldLock) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.width = '100%';
      document.body.dataset.scrollY = scrollY;
    } else {
      const scrollY = document.body.dataset.scrollY || '0';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.right = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY));
    }
  }, [isSidebarOpen, isMobileMenuOpen]);

  return (
    <StoreContext.Provider
      value={{ token, setToken, url, isSidebarOpen, setIsSidebarOpen, isMobileMenuOpen, setIsMobileMenuOpen }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
