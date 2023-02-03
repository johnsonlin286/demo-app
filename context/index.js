import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider  = ({ children }) => {
  const [about, setAbout] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    color: 'primary',
    text: '',
  });

  return (
    <AppContext.Provider
      value={{
        about,
        setAbout,
        toast,
        setToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}