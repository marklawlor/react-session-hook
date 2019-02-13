import "jest-dom/extend-expect";
import jwt from "jsonwebtoken";
import React from "react";

import { act, render } from "react-testing-library";
import { cleanup } from "../../utils";

import Component from "../using-expiration-option";

afterEach(cleanup);

jest.useFakeTimers();

test("using-expiration-option", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");

  act(() => jest.runOnlyPendingTimers());

  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: Unknown");
});
