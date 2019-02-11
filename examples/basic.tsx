import jwt from "jsonwebtoken";
import React from "react";

import useSession from "../src";

export default () => {
  const session = useSession();

  // Typescript projects can use session.isAuthenticatedGuard() as a typeguard.
  // You can also use session.isAuthenticated === true
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
