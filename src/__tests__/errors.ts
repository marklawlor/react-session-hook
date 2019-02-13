import { act, testHook } from "react-testing-library";

import { cleanup, hideConsoleErrors, token } from "../../utils";
import useSession, { cookies } from "../index";

beforeEach(hideConsoleErrors);

afterEach(cleanup);

test("non-object arguments", () => {
  // @ts-ignore
  expect(() => testHook(() => useSession("string"))).toThrowError();
});

test("global logout enabled", () => {
  const { result } = testHook(() =>
    useSession({
      profile: { name: "John Smith1" }
    })
  );

  expect(result.current.profile!.name).toBe("John Smith1");

  act(() => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "logout",
        newValue: "0"
      })
    );
  });

  expect(result.current.isAuthenticated).toBeFalsy();
  expect(result.current.profile).toBeUndefined();
});

test("global logout disabled", () => {
  const { result } = testHook(() =>
    useSession({
      globalLogout: false,
      profile: { name: "John Smith2" }
    })
  );

  expect(result.current.isAuthenticated).toBeTruthy();
  expect(result.current.profile!.name).toBe("John Smith2");

  act(() => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "logout",
        newValue: "0"
      })
    );
  });

  expect(result.current.isAuthenticated).toBeTruthy();
  expect(result.current.profile!.name).toBe("John Smith2");
});

test("global login enabled", () => {
  const { result } = testHook(() => useSession());

  expect(result.current.isAuthenticated).toBeFalsy();
  expect(result.current.profile).toBeUndefined();

  cookies.set({ token });

  act(() => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "login",
        newValue: "0"
      })
    );
  });

  expect(result.current.isAuthenticated).toBeTruthy();
  expect(result.current.profile!.name).toBe("John Smith4");
});

test("global login disabled", () => {
  const { result } = testHook(() =>
    useSession({
      globalLogin: false
    })
  );

  expect(result.current.isAuthenticated).toBeFalsy();
  expect(result.current.profile).toBeUndefined();

  cookies.set({ token });

  act(() => {
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "login",
        newValue: "0"
      })
    );
  });

  expect(result.current.isAuthenticated).toBeFalsy();
  expect(result.current.profile).toBeUndefined();
});
