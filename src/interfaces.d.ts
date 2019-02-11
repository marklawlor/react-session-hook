export interface Profile {
  [index: string]: any;
}

export type UseSession<TProfile = Profile> =
  | AuthenticatedSession<TProfile>
  | UnAuthenticatedSession<TProfile>;

interface AbstractSession<TProfile = Profile> extends Tokens {
  initialized: boolean;

  expiration?: Date;
  refreshFn?: SessionRefreshFn;
  storage: Storage;

  setSession: (session: any) => void;
  removeSession: () => void;

  errorMessage?: string;
  setErrorMessage: (message?: string) => void;
  clearErrorMessage: () => void;

  isAuthenticatedGuard: (
    this: AbstractSession<TProfile>
  ) => this is AuthenticatedSession<TProfile>;
}

interface AuthenticatedSession<TProfile = Profile>
  extends AbstractSession<TProfile> {
  profile: TProfile;
  isAuthenticated: true;
  refreshInterval: number;
}

interface UnAuthenticatedSession<TProfile = Profile>
  extends AbstractSession<TProfile> {
  profile: null;
  isAuthenticated: false;
  refreshInterval: null;
}

export type UseSessionOptions<TProfile = Profile> = Partial<
  RequiredUseSessionOptions<TProfile>
>;

export interface RequiredUseSessionOptions<TProfile = Profile> extends Tokens {
  storage: Storage;
  profile?: TProfile;
  expiration?: Date | null;
  errorMessage?: string;
  refreshFn?: (session: any) => any | Promise<any>;
  profileFn?: (token: string) => any | Promise<any>;
  jwt: boolean;
  req?: HttpReq;
}

export interface Tokens {
  token?: string;
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}

export type SessionRefreshFn = <TProfile>(session: any) => any;

export interface HttpReq {
  headers: {
    cookie?: string;
  };
}

export interface Storage {
  set: (tokens: Tokens, expires?: any, req?: HttpReq) => void;
  get: (req?: HttpReq) => Tokens;
  remove: () => void;
}
