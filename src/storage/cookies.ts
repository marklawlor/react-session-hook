import Cookies from "universal-cookie";

import { HttpReq, Tokens } from "../interfaces";

const isBrowser =
  typeof window !== "undefined" && typeof window.document !== "undefined";

const inMemoryCookies = new Cookies({});

const getCookies = (req?: HttpReq) => {
  if (isBrowser) {
    return new Cookies();
  } else if (req && req.headers.cookie) {
    return new Cookies(req.headers.cookie);
  } else {
    return inMemoryCookies;
  }
};

const set = (tokens: Tokens, expires?: Date) => {
  const { accessToken, idToken, refreshToken, token } = tokens;
  const cookies = getCookies();

  const options = {
    expires
  };

  if (accessToken) {
    cookies.set("accessToken", accessToken, options);
  }

  if (idToken) {
    cookies.set("idToken", idToken, options);
  }

  if (refreshToken) {
    cookies.set("refreshToken", refreshToken, options);
  }

  if (token) {
    cookies.set("token", token, options);
  }
};

const get = (req?: HttpReq): Tokens => {
  const cookies = getCookies(req);

  const accessToken = cookies.get("accessToken");
  const idToken = cookies.get("idToken");
  const refreshToken = cookies.get("refreshToken");
  const token = cookies.get("token");

  return { accessToken, idToken, refreshToken, token };
};

const remove = () => {
  const cookies = getCookies();

  cookies.remove("accessToken");
  cookies.remove("idToken");
  cookies.remove("refreshToken");
  cookies.remove("token");
};

export default {
  get,
  remove,
  set
};
