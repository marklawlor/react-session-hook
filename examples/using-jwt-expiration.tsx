import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionProvider } from "../src";

const token = jwt.sign(
  {
    exp: (Date.now() + 1 * 60 * 1000) / 1000, // 1 minute
    name: "John Smith"
  },
  "secret"
);

// After 1 minute, the text will change from
// 'My Name Is: John Smith' to 'My Name Is: Unknown'
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
  <UseSessionProvider initialToken={token}>
    <Component />
  </UseSessionProvider>
);
