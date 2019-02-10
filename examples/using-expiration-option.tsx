import React from "react";
import jwt from "jsonwebtoken";

import useSession from "../src";

const payload = {
  name: "John Smith"
};

const token = jwt.sign(payload, "secret");

/***
 * After 1 minute, the text will change from
 * 'My Name Is: John Smith' to 'My Name Is: Unknown'
 */
export default () => {
  const session = useSession({
    token,
    expiration: new Date(Date.now() + 1000)
  });

  // isAuthenticatedGuard is not needed, it only provides a Typescript typeguard
  // you can also use if (session.isAuthenticated === true)
  if (session.isAuthenticatedGuard()) {
    return <div>My Name Is: {session.profile.name}</div>;
  } else {
    return <div>My Name Is: Unknown</div>;
  }
};
