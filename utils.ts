import jwt from "jsonwebtoken";
import { cleanup as rtlCleanup } from "react-testing-library";

import { cookies } from "./src";

export const cleanup = () => {
  cookies.remove();
  rtlCleanup();
};

export const hideConsoleErrors = () => {
  // when the error's thrown a bunch of console.errors are called even though
  // the error boundary handles the error. This makes the test output noisy,
  // so we'll mock out console.error
  jest.spyOn(console, "error").mockImplementation(() => undefined);
};

export const token = jwt.sign(
  {
    exp: (Date.now() + 1 * 60 * 1000) / 1000, // 1 minute
    name: "John Smith"
  },
  "secret"
);
