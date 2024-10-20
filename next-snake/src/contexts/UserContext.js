"use client";
import React, { createContext, useState, useContext } from 'react';

export const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const setUserWithLog = (newUser) => {
    console.log('Setting new user:', newUser);
    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, setUser: setUserWithLog }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

