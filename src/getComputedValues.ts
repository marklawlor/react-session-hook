import jwtDecode from "jwt-decode";
import cookies from "./storage/cookies";

// import { Profile } from "./interfaces";

const getComputedValues = <TProfile>(
  options: Partial<any>,
  { jwt, profileFn }: any
): any => {
  const { idToken, accessToken, token } = options;
  let { profile, expiration } = options;

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
    expiration,
    isAuthenticated,
    profile
  };

  return state as any;
};

export default getComputedValues;
