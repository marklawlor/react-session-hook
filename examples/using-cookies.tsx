import React from "react";
import jwt from "jsonwebtoken";

import useSession, { cookies } from "../src";

const payload = {
  name: "John Smith"
};

const token = jwt.sign(payload, "secret");

cookies.set({ token });

export default () => {
  const session = useSession();

  // isAuthenticatedGuard is not needed, it only provides a Typescript typeguard
  // you can also use if (session.isAuthenticated === true)
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
