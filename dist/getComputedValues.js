"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt_decode_1 = __importDefault(require("jwt-decode"));
// import { Profile } from "./interfaces";
const getComputedValues = (options, { jwt, profileFn }) => {
    let { profile, expiration, idToken, accessToken, token } = options;
    if (profileFn) {
        if (accessToken && idToken) {
            profile = profileFn(idToken);
        }
        else if (token) {
            profile = profileFn(token);
        }
    }
    else if (jwt) {
        if (accessToken && idToken) {
            profile = jwt_decode_1.default(idToken);
        }
        else if (token) {
            profile = jwt_decode_1.default(token);
        }
    }
    if (profile && profile.exp) {
        expiration = new Date(profile.exp * 1000);
    }
    else if (profile) {
        const MAX_TIMESTAMP = 8640000000000000;
        expiration = new Date(MAX_TIMESTAMP);
    }
    let isAuthenticated = true;
    if (!(accessToken || token)) {
        isAuthenticated = false;
    }
    else if (expiration) {
        isAuthenticated = Date.now() < expiration.valueOf();
    }
    const state = Object.assign({}, options, { isAuthenticated,
        profile,
        expiration });
    return state;
};
exports.default = getComputedValues;
//# sourceMappingURL=getComputedValues.js.map