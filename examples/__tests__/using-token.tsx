import React from "react";
import "jest-dom/extend-expect";
import jwt from "jsonwebtoken";

import { render } from "react-testing-library";
import { cleanup } from "./utils";

import Component from "../using-token";

afterEach(cleanup);

const payload = {
  name: "John Smith"
};

const token = jwt.sign(payload, "secret");

test("using-token", () => {
  const { getByText } = render(<Component token={token} />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");
});
