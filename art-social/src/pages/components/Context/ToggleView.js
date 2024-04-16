import React, { createContext, useContext, useState, useEffect } from "react";

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [view, setView] = useState(() => localStorage.getItem("Grid") || "Timeline");

  useEffect(() => {
    localStorage.setItem("view", view);
  }, [view]);

  const toggleView = () => {
    setView((prevView) => (prevView === "Grid" ? "Timeline" : "Grid"));
  };

  return (
    <ViewContext.Provider value={{ view, toggleView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => useContext(ViewContext);
