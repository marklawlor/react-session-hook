import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionProvider } from "../src";

const profile = {
  name: "John Smith"
};

const token = JSON.stringify(profile);

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
  <UseSessionProvider jwt={false} initialToken={token} initialProfile={profile}>
    <Component />
  </UseSessionProvider>
);
