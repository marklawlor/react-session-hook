import React from "react";

import { SessionContext } from "./interfaces";

const defaults: SessionContext = {
  globalLogin: true,
  globalLogout: true,
  jwt: true,
  refreshFn: undefined,
  refreshInterval: 15 * 60 * 1000,
  storage: {} as any,

  profileFn: undefined,

  setSession: (patialState: any) => undefined,

  expiration: undefined,

  accessToken: undefined,
  idToken: undefined,
  refreshToken: undefined,
  token: undefined
};

export const UseSessionContext = React.createContext<SessionContext>(defaults);

export const UseSessionProvider: React.StatelessComponent<
  Partial<SessionContext>
> = ({ children, ...props }) => {
  const [state, setState] = React.useState(() => ({ ...defaults, ...props }));

  return (
    <UseSessionContext.Provider value={{ ...state, ...props, setState }}>
      {children}
    </UseSessionContext.Provider>
  );
};
