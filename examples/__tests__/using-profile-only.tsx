import React from "react";
import "jest-dom/extend-expect";
import { render } from "react-testing-library";
import { cleanup } from "./utils";

import Component from "../using-profile-only";

afterEach(cleanup);

test("using-profile-only", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");
});
