import React from "react";
import jwt from "jsonwebtoken";

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

/**
 * Have a refreshFn that cycles between two tokens
 */
export default () => {
  const session = useSession({
    token: firstToken,
    expiration: null,
    refreshFn: ({ token }) => {
      if (token === firstToken)
        return {
          token: secondToken
        };
      else {
        return {
          token: firstToken
        };
      }
    }
  });

  // isAuthenticatedGuard is not needed, it only provides a Typescript typeguard
  // you can also use if (session.isAuthenticated === true)
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
