import React from "react";
import jwt from "jsonwebtoken";

import useSession from "../src";

const payload = {
  name: "John Smith",
  exp: (Date.now() + 1 * 60 * 1000) / 1000 // 1 minute
};

const token = jwt.sign(payload, "secret");

/***
 * After 1 minute, the text will change from
 * 'My Name Is: John Smith' to 'My Name Is: Unknown'
 */
export default () => {
  const session = useSession({ token });

  // isAuthenticatedGuard is not needed, it only provides a Typescript typeguard
  // you can also use if (session.isAuthenticated === true)
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
