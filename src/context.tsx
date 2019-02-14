import React from "react";

import {
  DispatchAction,
  Profile,
  UseSession,
  UseSessionProviderProps
} from "./interfaces";

import cookies from "./storage/cookies";

import { getState, reducer } from "./reducer";
import useGlobalEvents from "./utils/useGlobalEvents";
import useSessionTimers from "./utils/useSessionTimers";

const defaults: UseSession<any> = {
  globalLogin: true,
  globalLogout: true,
  jwt: true,
  refreshInterval: 15 * 60 * 1000,
  storage: cookies,

  isAuthenticated: false,

  removeSession: () => undefined,
  setSession(value: any) {
    this.dispatch({ type: "setSession", value });
  },

  clearErrorMessage: () => undefined,
  setErrorMessage: () => undefined,

  dispatch: () => undefined,

  isAuthenticatedGuard: () => false
};

export const UseSessionContext = React.createContext(defaults);

export const UseSessionProvider = <TProfile extends Profile = Profile>(
  props: Partial<UseSessionProviderProps<TProfile>> & {
    children?: React.ReactNode;
  }
) => {
  const {
    children,
    initialAccessToken,
    initialIdToken,
    initialProfile,
    initialRefreshToken,
    initialToken,
    ...options
  } = { ...defaults, ...props };

  const { accessToken, idToken, refreshToken, token } = options.storage.get();

  const initialState: UseSession<TProfile> = {
    accessToken: initialAccessToken || accessToken,
    idToken: initialIdToken || idToken,
    refreshToken: initialRefreshToken || refreshToken,
    token: initialToken || token,

    profile: initialProfile,

    isAuthenticated: false,

    ...options
  };

  const [state, dispatch] = React.useReducer<
    React.Reducer<UseSession<TProfile>, DispatchAction>,
    UseSession<TProfile>
  >(reducer, initialState, getState);

  const session: UseSession<TProfile> = {
    ...state,

    dispatch,

    setSession: (value: any) => dispatch({ type: "setSession", value }),

    removeSession: () => dispatch({ type: "removeSession" }),

    clearErrorMessage: () => dispatch({ type: "setErrorMessage" }),

    setErrorMessage: (value?: string) => {
      dispatch({ type: "setErrorMessage", value });
    },

    isAuthenticatedGuard() {
      return state.isAuthenticated;
    }
  };

  useGlobalEvents(session);
  useSessionTimers(session);

  return (
    <UseSessionContext.Provider value={session}>
      {children}
    </UseSessionContext.Provider>
  );
};
