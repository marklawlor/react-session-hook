import { useContext } from "react";
import { UseSessionContext } from "./context";
import { Profile, UseSession } from "./interfaces";

export * from "./interfaces";
export { default as cookies } from "./storage/cookies";
export { UseSessionProvider } from "./context";

export default <TProfile extends Profile = Profile>() => {
  return useContext(UseSessionContext as React.Context<UseSession<TProfile>>);
};
