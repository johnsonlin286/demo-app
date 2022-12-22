import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider  = ({ children }) => {
  const [about, setAbout] = useState(false);

  return (
    <AppContext.Provider
      value={{
        about,
        setAbout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}