import useInterval from "./useInterval";

import { UseSession } from "../interfaces";

export default <TProfile>(session: UseSession<TProfile>) => {
  const {
    expiration,
    isAuthenticated,
    removeSession,
    refreshFn,
    refreshInterval,
    setSession
  } = session;

  /***
   * Remove Session Timer
   */
  const sessionExpiresIn =
    expiration && isAuthenticated ? expiration.valueOf() - Date.now() : null;

  useInterval(() => removeSession(), sessionExpiresIn);

  /***
   * RefreshFn timer
   */
  let refreshExpiresIn: number | null = null;

  if (refreshFn && refreshInterval) {
    refreshExpiresIn = Math.min(refreshInterval, sessionExpiresIn || Infinity);
  }

  useInterval(() => {
    setSession(refreshFn!(session));
  }, refreshExpiresIn);
};
