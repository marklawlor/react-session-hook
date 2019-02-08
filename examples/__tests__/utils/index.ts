import { cleanup as rtlCleanup } from "react-testing-library";
import { cookies } from "../../../src";

export const cleanup = () => {
  cookies.remove();
  rtlCleanup();
};
