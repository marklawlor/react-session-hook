import jwt from "jsonwebtoken";
import React from "react";

import useSession from "../src";

export default () => {
  const session = useSession({
    profile: {
      name: "John Smith"
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
