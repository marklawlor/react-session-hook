import { useEffect, useState } from "react";

import getComputedValues from "./getComputedValues";
import isAuthenticatedGuard from "./isAuthenticatedSession";
import cookies from "./storage/cookies";
import useInterval from "./useInterval";

import {
  Profile,
  RequiredUseSessionOptions,
  UseSession,
  UseSessionOptions
} from "./interfaces";

export const defaultOptions = {
  isAuthenticated: false,
  jwt: true,
  refreshFn: undefined,
  refreshInterval: 15 * 60 * 1000,
  storage: cookies
};

const userOptions: UseSessionOptions<any> = {};

const getInitialState = <TProfile>(
  useSessionOptions: UseSessionOptions<TProfile>
) => {
  let options: RequiredUseSessionOptions<TProfile> = {
    ...defaultOptions,
    ...userOptions,
    ...useSessionOptions
  };

  options = { ...options.storage.get(options.req), ...options };
  options = { ...options, ...getComputedValues(options, options) };

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

    const { accessToken, idToken, refreshToken, storage, token } = mergedState;

    if (mergedState.isAuthenticated) {
      storage.set(
        { accessToken, idToken, refreshToken, token },
        options.expiration
      );

      setState(mergedState);
    } else {
      setState({
        ...mergedState,
        accessToken: undefined,
        expiration: undefined,
        idToken: undefined,
        isAuthenticated: false,
        refreshToken: undefined,
        token: undefined
      });
    }
  };

  const removeSession = () => {
    window.localStorage.setItem("logout", Date.now().toString());
    setSession({
      accessToken: undefined,
      expiration: undefined,
      idToken: undefined,
      profile: undefined,
      refreshToken: undefined,
      token: undefined
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

    removeSession,
    setSession,

    clearErrorMessage,
    errorMessage,
    setErrorMessage,

    isAuthenticatedGuard(this: any) {
      return isAuthenticatedGuard(this);
    }
  };
};

useSession.config = (options: UseSessionOptions<any>) => {
  Object.assign(userOptions, options);
};

export default useSession;
