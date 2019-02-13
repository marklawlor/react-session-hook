import "jest-dom/extend-expect";
import jwt from "jsonwebtoken";
import React from "react";

import { render, waitForElement } from "react-testing-library";
import { cleanup } from "../../utils";

import Component from "../using-string-token-with-profileFn";

afterEach(cleanup);

test("using-string-token-with-profileFn", async () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");
});
