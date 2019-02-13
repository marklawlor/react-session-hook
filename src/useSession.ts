import { createContext, useContext, useEffect, useState } from "react";

import jwtDecode from "jwt-decode";

import { Profile, UseSession } from "./interfaces";

import { UseSessionContext } from "./context";
import getExpiration from "./getExpiration";
import getProfile from "./getProfile";
import getIsAuthenticated, { isAuthenticatedGuard } from "./isAuthenticated";

import useGlobalEvents from "./useGlobalEvents";
import useSessionRefresh from "./useSessionRefresh";

const useSession = <TProfile extends Profile = Profile>(): UseSession<
  TProfile
> => {
  const context = useContext(UseSessionContext);
  const { setSession, storage } = context;

  const profile = getProfile<TProfile>(context);
  const expiration = getExpiration({ ...context, profile });
  const isAuthenticated = getIsAuthenticated({ ...context, profile });

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
    storage.remove();
  };

  const clearErrorMessage = () => setErrorMessage();
  const setErrorMessage = (errorMessage?: string) => {
    setSession({ errorMessage });
  };

  const session: UseSession<TProfile> = {
    ...context,

    expiration,
    isAuthenticated,
    profile,

    removeSession,

    clearErrorMessage,
    setErrorMessage,

    isAuthenticatedGuard(this: any) {
      return isAuthenticatedGuard(this);
    }
  };

  useGlobalEvents(session);
  useSessionRefresh(session);

  return session;
};

export default useSession;
