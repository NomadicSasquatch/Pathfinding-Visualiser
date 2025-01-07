'use client';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const GlobalDelayContext = createContext();

export const useGlobalDelay = () => useContext(GlobalDelayContext);

export function GlobalDelayProvider({ children }) {
  const [delay, setDelay] = useState(30);
  const delayRef = useRef(delay);
  const [chunkSize, setChunkSize] = useState(5.5);
  const chunkSizeRef = useRef(chunkSize);
  
  useEffect(() => {
    delayRef.current = delay;
}, [delay]);
  useEffect(() => {
    setChunkSize((-0.0621 * delayRef.current) + 10.31);
 }, [delayRef.current]);
 useEffect(() => {
    chunkSizeRef.current = chunkSize;
 }, [chunkSize]);

  return (
    <GlobalDelayContext.Provider value={{ delay, setDelay, chunkSizeRef, delayRef }}>
      {children}
    </GlobalDelayContext.Provider>
  );
};
