import { AuthenticatedSession, UseSession } from "./interfaces";

export function isAuthenticatedGuard<TProfile>(
  session: UseSession<TProfile>
): session is AuthenticatedSession<TProfile> {
  return session.isAuthenticated === true;
}

export default ({ expiration, profile }: any) => {
  if (expiration === null && profile) {
    return true;
  }

  if (expiration) {
    return Date.now() < expiration.valueOf();
  }

  return false;
};
