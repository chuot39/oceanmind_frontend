import React, { useEffect, createContext } from "react";
import useSkin from "../hooks/useSkin";

const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const { skin } = useSkin()
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', skin); // Set data-theme attribute
  }, [skin]);

  return (
    <ThemeContext.Provider value={{ skin }} >
      {children}
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
