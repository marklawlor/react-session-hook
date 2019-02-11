import jwt from "jsonwebtoken";
import React from "react";

import useSession, { UseSessionOptions } from "../src";

const payload = {
  name: "John Smith"
};

const token = JSON.stringify(payload);

export default () => {
  const session = useSession({
    jwt: false,
    profileFn: idToken => JSON.parse(idToken),
    token
  });

  // isAuthenticatedGuard is not needed, it only provides a Typescript typeguard
  // you can also use if (session.isAuthenticated === true)
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
