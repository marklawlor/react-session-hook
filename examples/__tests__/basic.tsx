import React from "react";
import "jest-dom/extend-expect";
import { render } from "react-testing-library";
import { cleanup } from "./utils";

import Component from "../basic";

afterEach(cleanup);

test("basic", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: Unknown");
});
