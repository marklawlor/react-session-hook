import jwtDecode from "jwt-decode";

import { UseSessionContext } from "./context";

interface GetProfileOptions {
  jwt: boolean;
  profileFn?: any;
  accessToken?: string;
  idToken?: string;
  token?: string;
}

const getProfile = <TProfile>({
  jwt,
  profileFn,
  accessToken,
  idToken,
  token
}: GetProfileOptions): TProfile | undefined => {
  let profile;

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

export default getProfile;
