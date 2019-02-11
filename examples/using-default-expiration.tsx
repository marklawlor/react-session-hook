import jwt from "jsonwebtoken";
import React from "react";

import useSession from "../src";

const token = jwt.sign(
  {
    name: "John Smith"
  },
  "secret"
);

// After 10 hours, the text will change from
// 'My Name Is: John Smith' to 'My Name Is: Unknown'
export default () => {
  const session = useSession({ token });

  // Typescript projects can use session.isAuthenticatedGuard() as a typeguard.
  // You can also use session.isAuthenticated === true
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
