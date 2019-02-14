import jwtDecode from "jwt-decode";

import { AuthenticatedSession, DispatchAction, UseSession } from "./interfaces";

export const reducer = <TProfile>(
  state: UseSession<TProfile>,
  action: DispatchAction
): UseSession<TProfile> => {
  if (action.type === "setSession") {
    state.storage.set(action.value);
    return getState({ ...state, ...action.value });
  }

  if (action.type === "removeSession") {
    window.localStorage.setItem("logout", Date.now().toString());
    state.storage.remove();

    return getState({
      ...state,
      expiration: null,
      isAuthenticated: false,
      profile: undefined,

      accessToken: undefined,
      idToken: undefined,
      refreshToken: undefined,
      token: undefined
    });
  }

  if (action.type === "setErrorMessage") {
    return getState({ ...state, errorMessage: action.value });
  }

  throw new Error();
};

export const getState = <TProfile>(
  state: UseSession<TProfile>
): UseSession<TProfile> => {
  const profile = getProfile<any>({ ...state });
  const expiration = getExpiration({ ...state, profile });
  const isAuthenticated = getIsAuthenticated({ ...state, expiration, profile });

  return {
    ...state,

    expiration,
    isAuthenticated,
    profile
  };
};

export const getProfile = <TProfile>({
  accessToken,
  idToken,
  jwt,
  profile,
  profileFn,
  token
}: any): TProfile | undefined => {
  if (profileFn) {
    if (accessToken && idToken) {
      profile = profileFn(idToken);
    } else if (token) {
      profile = profileFn(token);
    }
  } else if (jwt) {
    if (accessToken && idToken) {
      profile = jwtDecode<TProfile>(idToken);
    } else if (token) {
      profile = jwtDecode<TProfile>(token);
    }
  }

  return profile;
};

export const getExpiration = ({ expiration, profile }: any) => {
  if (expiration || expiration === null) {
    return expiration;
  }

  if (profile && profile.exp) {
    return new Date(profile.exp * 1000);
  }

  return new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
};

export const getIsAuthenticated = ({ expiration, profile }: any) => {
  if (expiration === null && profile) {
    return true;
  }

  if (expiration && profile) {
    return Date.now() < expiration.valueOf();
  }

  return false;
};
