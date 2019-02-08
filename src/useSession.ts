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
  refreshInterval: null,
  refreshFn: undefined,
  storage: cookies
};

const useSession = <TProfile = Profile>(
  partialOptions: UseSessionOptions<TProfile> = {}
): UseSession<TProfile> => {
  if (typeof partialOptions !== "object") {
    throw new Error("Invalid option passed to useSession");
  }

  let options: RequiredUseSessionOptions<TProfile> = {
    ...defaultOptions,
    ...partialOptions
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

  const [state, setState] = useState<any>(options);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    options.errorMessage
  );

  const setSession = (newState: Partial<any>) => {
    const mergedState = getComputedValues({ ...state, ...newState }, options);

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
      if (options.jwt && event.key === "login") {
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
    expiration && isAuthenticated
      ? // Need to cap at max 32-bit Int
        Math.min(2147483647, expiration.valueOf() - Date.now())
      : null;

  useInterval(() => removeSession(), sessionExpiresIn);

  /***
   * RefreshFn timer
   */
  let refreshExpiresIn: number | null;

  if (refreshFn && isAuthenticated) {
    refreshExpiresIn = Math.min(refreshInterval, sessionExpiresIn || Infinity);
  } else {
    refreshExpiresIn = null;
  }

  useInterval(async () => {
    setSession(await refreshFn!(state));
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
