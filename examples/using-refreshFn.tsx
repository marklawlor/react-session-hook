import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionProvider } from "../src";

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

const refreshFn = ({ token }: any) => {
  if (token === firstToken) {
    return {
      token: secondToken
    };
  } else {
    return {
      token: firstToken
    };
  }
};

// Have a refreshFn that cycles between two tokens
const Component = () => {
  const session = useSession<{ name: string }>();

  // Typescript projects can use session.isAuthenticatedGuard() as a typeguard.
  // You can also use session.isAuthenticated === true
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};

export default () => (
  <UseSessionProvider
    expiration={null}
    initialToken={firstToken}
    refreshFn={refreshFn}
  >
    <Component />
  </UseSessionProvider>
);
