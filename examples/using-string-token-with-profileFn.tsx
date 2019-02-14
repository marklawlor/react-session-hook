import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionProvider } from "../src";

const token = JSON.stringify({
  name: "John Smith"
});

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
    jwt={false}
    initialToken={token}
    profileFn={(idToken: any) => JSON.parse(idToken)}
  >
    <Component />
  </UseSessionProvider>
);
