import { useState, useEffect } from "react";

import useInterval from "./useInterval";
import getComputedValues from "./getComputedValues";
import isAuthenticatedGuard from "./isAuthenticatedSession";
import cookies from "./storage/cookies";

import {
  Profile,
  RequiredUseSessionOptions,
  UseSession,
  UseSessionOptions
} from "./interfaces";

export const defaultOptions = {
  jwt: true,
  isAuthenticated: false,
  refreshInterval: 15 * 60 * 1000,
  refreshFn: undefined,
  storage: cookies
};

const getInitialState = <TProfile>(
  useSessionOptions: UseSessionOptions<TProfile>
) => {
  let options: RequiredUseSessionOptions<TProfile> = {
    ...defaultOptions,
    ...useSessionOptions
  };

  options = {
    ...options.storage.get(options.req),
    ...options
  };

  const computedValues = getComputedValues(options, options);

  options = {
    ...options,
    ...computedValues
  };

  options.storage.set(options, options.expiration);

  return options;
};

const useSession = <TProfile = Profile>(
  options: UseSessionOptions<TProfile> = {}
): UseSession<TProfile> => {
  if (typeof options !== "object") {
    throw new Error("Invalid option passed to useSession");
  }

  const [state, setState] = useState<any>(() => getInitialState(options));

  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    state.errorMessage
  );

  const setSession = (newState: Partial<any>) => {
    const mergedState = getComputedValues({ ...state, ...newState }, state);

    const {
      accessToken,
      isAuthenticated,
      expiration,
      idToken,
      refreshToken,
      storage,
      token
    } = mergedState;

    if (isAuthenticated) {
      storage.set({ accessToken, idToken, refreshToken, token }, expiration);

      setState(mergedState);
    } else {
      setState({
        ...mergedState,
        expiration: undefined,
        isAuthenticated: false,
        accessToken: undefined,
        idToken: undefined,
        refreshToken: undefined,
        token: undefined
      });
    }
  };

  const removeSession = () => {
    window.localStorage.setItem("logout", Date.now().toString());
    setSession({
      expiration: undefined,
      accessToken: undefined,
      idToken: undefined,
      refreshToken: undefined,
      token: undefined,
      profile: undefined
    });
    state.storage.remove();
  };

  const clearErrorMessage = () => setErrorMessage(undefined);

  /**
   * Global logout/login
   */
  useEffect(() => {
    const logoutEvent = (event: StorageEvent) => {
      if (event.key === "logout") {
        removeSession();
      }
      if (state.jwt && event.key === "login") {
        setSession(state.storage.get());
      }
    };

    window.addEventListener("storage", logoutEvent);

    return () => {
      window.localStorage.removeItem("logout");
      window.localStorage.removeItem("login");
      window.removeEventListener("storage", logoutEvent);
    };
  }, []);

  const { expiration, refreshFn, refreshInterval, isAuthenticated } = state;

  /***
   * Remove Session Timer
   */
  const sessionExpiresIn =
    expiration && isAuthenticated ? expiration.valueOf() - Date.now() : null;

  useInterval(() => removeSession(), sessionExpiresIn);

  /***
   * RefreshFn timer
   */
  let refreshExpiresIn: number | null = null;

  if (refreshFn && refreshInterval) {
    refreshExpiresIn = Math.min(refreshInterval, sessionExpiresIn || Infinity);
  }

  useInterval(() => {
    setSession(refreshFn!(state));
  }, refreshExpiresIn);

  return {
    ...state,

    setSession,
    removeSession,

    errorMessage,
    setErrorMessage,
    clearErrorMessage,

    isAuthenticatedGuard(this: any) {
      return isAuthenticatedGuard(this);
    }
  };
};

export default useSession;
