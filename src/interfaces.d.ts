export type Profile = Record<string, any>;

export interface DispatchAction {
  type: string;
  value?: any;
}

export interface Tokens {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  token?: string;
}

export interface UseSessionOptions<TProfile> {
  globalLogin: boolean;
  globalLogout: boolean;
  jwt: boolean;
  refreshFn?: any;
  refreshInterval?: number | null;
  profileFn?: (token: string) => TProfile;
  storage: any;
  expiration?: Date | null;
}

export interface UseSessionProviderProps<TProfile>
  extends UseSessionOptions<TProfile> {
  initialAccessToken: string;
  initialIdToken: string;
  initialRefreshToken: string;
  initialToken: string;

  initialProfile: TProfile;
}

export interface UseSession<TProfile> extends UseSessionOptions<TProfile> {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
  token?: string;

  errorMessage?: string;

  profile?: TProfile;

  expiration?: Date | null;

  isAuthenticated: boolean;

  setSession: (session: any) => void;
  removeSession: () => void;
  setErrorMessage: (message?: string) => void;
  clearErrorMessage: () => void;

  dispatch: React.Dispatch<{ type: string; value?: any }>;

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

export interface HttpReq {
  headers: {
    cookie?: string;
  };
}

// export interface Storage {
//   set: (tokens: Tokens, expires?: any, req?: HttpReq) => void;
//   get: (req?: HttpReq) => Tokens;
//   remove: () => void;
// }
