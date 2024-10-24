"use client";

import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface ContextState {
  context: string[];
  addContext: (contextInfo: string) => void;
}

const Context = createContext<ContextState | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [context, setContext] = useState<string[]>([]);

  const addContext = useCallback((contextInfo: string) => {
    setContext((prevContext) => [...prevContext, contextInfo]);
  }, []);

  return (
    <Context.Provider value={{ context, addContext }}>
      {children}
    </Context.Provider>
  );
};

export const useContextState = () => {
  const context = useContext(Context);
  if (!context) {
    throw new Error("useContextState must be used within a ContextProvider");
  }
  return context;
};
