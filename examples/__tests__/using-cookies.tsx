import "jest-dom/extend-expect";
import React from "react";
import { render } from "react-testing-library";
import { cleanup } from "../../utils";

import Component from "../using-cookies";

afterEach(cleanup);

test("using-cookies", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");
});
