import React from "react";
import jwt from "jsonwebtoken";

import useSession, { UseSessionOptions } from "../src";

export default ({ token }: UseSessionOptions) => {
  const session = useSession({ token });

  // isAuthenticatedGuard is not needed, it only provides a Typescript typeguard
  // you can also use if (session.isAuthenticated === true)
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
