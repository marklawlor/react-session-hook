import { useEffect } from "react";

import { UseSession } from "./interfaces";

export default <TProfile>({
  globalLogin,
  globalLogout,
  setSession,
  removeSession,
  storage
}: UseSession<TProfile>) => {
  /**
   * Global logout/login
   */
  useEffect(() => {
    const logoutEvent = (event: StorageEvent) => {
      if (globalLogout && event.key === "logout") {
        removeSession();
      }

      if (globalLogin && event.key === "login") {
        setSession(storage.get());
      }
    };

    window.addEventListener("storage", logoutEvent);

    return () => {
      window.localStorage.removeItem("logout");
      window.localStorage.removeItem("login");
      window.removeEventListener("storage", logoutEvent);
    };
  }, [globalLogout, globalLogin]);
};
