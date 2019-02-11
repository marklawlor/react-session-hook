import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionOptions } from "../src";

const payload = {
  name: "John Smith"
};

const token = JSON.stringify(payload);

export default () => {
  const session = useSession({ token, profile: payload, jwt: false });

  // Typescript projects can use session.isAuthenticatedGuard() as a typeguard.
  // You can also use session.isAuthenticated === true
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
