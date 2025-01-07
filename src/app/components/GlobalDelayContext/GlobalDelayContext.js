'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalDelayContext = createContext();

export const useGlobalDelay = () => useContext(GlobalDelayContext);

export function GlobalDelayProvider({ children }) {
  const [delay, setDelay] = useState(30);
  const [chunkSize, setChunkSize] = useState(5.5);
  
  useEffect(() => {
    setChunkSize((-0.225 * delay) + 12.25);
 }, [delay]);

  return (
    <GlobalDelayContext.Provider value={{ delay, setDelay, chunkSize }}>
      {children}
    </GlobalDelayContext.Provider>
  );
};
