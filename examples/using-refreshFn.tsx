import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionOptions } from "../src";

const firstToken = jwt.sign(
  {
    name: "John Smith"
  },
  "secret"
);

const secondToken = jwt.sign(
  {
    name: "Jane Smith"
  },
  "secret"
);

useSession.config({
  expiration: null,
  refreshFn: ({ token }) => {
    if (token === firstToken) {
      return {
        token: secondToken
      };
    } else {
      return {
        token: firstToken
      };
    }
  },
  token: firstToken
});

// Have a refreshFn that cycles between two tokens
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
