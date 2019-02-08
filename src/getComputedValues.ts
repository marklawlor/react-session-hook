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

  if (profile && profile.exp) {
    expiration = new Date(profile.exp * 1000);
  } else if (profile) {
    const MAX_TIMESTAMP = 8640000000000000;
    expiration = new Date(MAX_TIMESTAMP);
  }

  let isAuthenticated = true;

  if (!(accessToken || token)) {
    isAuthenticated = false;
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
