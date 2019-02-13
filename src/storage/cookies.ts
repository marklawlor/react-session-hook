import Cookies from "universal-cookie";

import { HttpReq, Tokens } from "../interfaces";

interface CookieStorageOptions {
  req?: {
    headers: {
      cookie?: string;
    };
  };
  storageAliases: {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    token: string;
  };
}

const defaultOptions: CookieStorageOptions = {
  storageAliases: {
    accessToken: "accessToken",
    idToken: "idToken",
    refreshToken: "refreshToken",
    token: "token"
  }
};

const cookieStorage = (options: Partial<CookieStorageOptions> = {}) => {
  const { req, storageAliases } = { ...defaultOptions, ...options };

  const cookies = new Cookies(req ? req.headers.cookie : undefined);

  return {
    get: (): Tokens => {
      const allCookies = cookies.getAll();
      return {
        accessToken: allCookies[storageAliases.accessToken],
        idToken: allCookies[storageAliases.idToken],
        refreshToken: allCookies[storageAliases.refreshToken],
        token: allCookies[storageAliases.token]
      };
    },

    remove: () => {
      cookies.remove(storageAliases.accessToken);
      cookies.remove(storageAliases.idToken);
      cookies.remove(storageAliases.refreshToken);
      cookies.remove(storageAliases.token);
    },

    set: (
      { accessToken, idToken, refreshToken, token }: Tokens,
      expires?: Date
    ) => {
      if (accessToken) {
        cookies.set(storageAliases.accessToken, accessToken, { expires });
      }

      if (idToken) {
        cookies.set(storageAliases.idToken, idToken, { expires });
      }

      if (refreshToken) {
        cookies.set(storageAliases.refreshToken, refreshToken, { expires });
      }

      if (token) {
        cookies.set(storageAliases.token, token, { expires });
      }
    }
  };
};

cookieStorage.get = (options: Partial<CookieStorageOptions> = {}) => {
  return cookieStorage(options).get();
};

cookieStorage.set = (tokens: Tokens, expires?: Date) => {
  return cookieStorage().set(tokens, expires);
};

cookieStorage.remove = () => {
  return cookieStorage().remove();
};

export default cookieStorage;
