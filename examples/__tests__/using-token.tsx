import "jest-dom/extend-expect";
import jwt from "jsonwebtoken";
import React from "react";

import { render } from "react-testing-library";
import { cleanup } from "../../utils";

import Component from "../using-token";

afterEach(cleanup);

test("using-token", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");
});
