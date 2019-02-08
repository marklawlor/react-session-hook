"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useSession_1 = __importDefault(require("./useSession"));
var cookies_1 = require("./storage/cookies");
exports.cookies = cookies_1.default;
var isAuthenticatedSession_1 = require("./isAuthenticatedSession");
exports.isAuthenticated = isAuthenticatedSession_1.default;
exports.default = useSession_1.default;
//# sourceMappingURL=index.js.map