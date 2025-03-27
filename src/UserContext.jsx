import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userFilters, setUserFilters] = useState({ name: '', status: '' });

  return (
    <UserContext.Provider value={{ userFilters, setUserFilters }}>
      {children}
    </UserContext.Provider>
  );
};