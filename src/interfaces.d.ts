export type Profile = Record<string, any>;

export interface SessionContext {
  setSession: (partialState: any) => void;

  globalLogin: boolean;
  globalLogout: boolean;
  jwt: boolean;
  refreshFn: any;
  refreshInterval?: number | null;
  profileFn?: (token: string) => Profile;
  storage: any;

  expiration?: Date | null;

  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  token?: string;
}

export interface UseSession<TProfile extends Profile = Profile> extends SessionContext {
  profile?: TProfile;

  setSession: (session: any) => void;
  removeSession: () => void;
  setErrorMessage: (message?: string) => void;
  clearErrorMessage: () => void;

  isAuthenticated: boolean;
  isAuthenticatedGuard: (
    this: UseSession<TProfile>
  ) => this is AuthenticatedSession<TProfile>;
}

export interface AuthenticatedSession<TProfile> extends UseSession<TProfile> {
  profile: TProfile;
  isAuthenticated: true;
  refreshInterval?: number;
}

export interface UnAuthenticatedSession extends UseSession<any> {
  profile: undefined;
  isAuthenticated: false;
  refreshInterval?: null;
}

// export interface HttpReq {
//   headers: {
//     cookie?: string;
//   };
// }

// export interface Storage {
//   set: (tokens: Tokens, expires?: any, req?: HttpReq) => void;
//   get: (req?: HttpReq) => Tokens;
//   remove: () => void;
// }
