"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const universal_cookie_1 = __importDefault(require("universal-cookie"));
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined";
const inMemoryCookies = new universal_cookie_1.default({});
const getCookies = (req) => {
    if (isBrowser) {
        return new universal_cookie_1.default();
    }
    else if (req && req.headers.cookie) {
        return new universal_cookie_1.default(req.headers.cookie);
    }
    else {
        return inMemoryCookies;
    }
};
const set = (tokens, expires) => {
    const { accessToken, idToken, refreshToken, token } = tokens;
    const cookies = getCookies();
    const options = {
        expires: expires
    };
    if (accessToken) {
        cookies.set("accessToken", accessToken, options);
    }
    if (idToken) {
        cookies.set("idToken", idToken, options);
    }
    if (refreshToken) {
        cookies.set("refreshToken", refreshToken, options);
    }
    if (token) {
        cookies.set("token", token, options);
    }
};
const get = (req) => {
    const cookies = getCookies(req);
    const accessToken = cookies.get("accessToken");
    const idToken = cookies.get("idToken");
    const refreshToken = cookies.get("refreshToken");
    const token = cookies.get("token");
    return { accessToken, idToken, refreshToken, token };
};
const remove = () => {
    const cookies = getCookies();
    cookies.remove("accessToken");
    cookies.remove("idToken");
    cookies.remove("refreshToken");
    cookies.remove("token");
};
exports.default = {
    get,
    set,
    remove
};
//# sourceMappingURL=cookies.js.map