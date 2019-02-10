import cookies from "./storage/cookies";
import jwtDecode from "jwt-decode";

// import { Profile } from "./interfaces";

const getComputedValues = <TProfile>(
  options: Partial<any>,
  { jwt, profileFn }: any
): any => {
  let { profile, expiration, idToken, accessToken, token } = options;

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

  if (expiration === undefined) {
    if (profile && profile.exp) {
      expiration = new Date(profile.exp * 1000);
    } else if (profile) {
      expiration = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours
    }
  }

  let isAuthenticated = false;

  if (expiration === null && profile) {
    isAuthenticated = true;
  } else if (expiration) {
    isAuthenticated = Date.now() < expiration.valueOf();
  }

  const state = {
    ...options,
    isAuthenticated,
    profile,
    expiration
  };

  return state as any;
};

export default getComputedValues;
