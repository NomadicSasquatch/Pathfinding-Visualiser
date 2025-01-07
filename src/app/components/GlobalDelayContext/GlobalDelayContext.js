import React, { createContext, useContext, useState } from `react`;

const GlobalDelayContext = createContext();

export const useGlobalDelay = () => {
    return useContext(GlobalDelayContext);
};

export const GlobalDelayProvider = ({children}) => {
    const [delay, setDelay] = useState(30);

    return (
        <GlobalDelayContext.Provider value={{ delay, setDelay }}>
          {children}
        </GlobalDelayContext.Provider>
      );
};