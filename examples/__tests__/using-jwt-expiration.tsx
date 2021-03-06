import "jest-dom/extend-expect";
import jwt from "jsonwebtoken";
import React from "react";

import { act, render } from "react-testing-library";
import { cleanup } from "../../utils";

import Component from "../using-jwt-expiration";

afterEach(cleanup);

jest.useFakeTimers();

test("using-jwt-expiration", () => {
  const { getByText } = render(<Component />);
  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: John Smith");

  act(() => jest.runOnlyPendingTimers());

  expect(getByText(/^My Name Is:/)).toHaveTextContent("My Name Is: Unknown");
});
