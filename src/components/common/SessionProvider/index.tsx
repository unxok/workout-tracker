import { createContext, ReactNode, useContext } from "react";

type SessionState = {
  isValid: boolean;
};

const defaultSessionState: SessionState = {
  isValid: false,
};

const SessionContext = createContext<SessionState>({ ...defaultSessionState });

export const useSession = () => {
  const ctx = useContext(SessionContext);

  if (ctx === undefined) {
    throw new Error("useSession must be used within a SessionProvider!");
  }

  return ctx;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SessionContext.Provider value={{ ...defaultSessionState }}>
      {children}
    </SessionContext.Provider>
  );
};
