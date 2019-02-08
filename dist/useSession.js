"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useInterval_1 = __importDefault(require("./useInterval"));
const getComputedValues_1 = __importDefault(require("./getComputedValues"));
const isAuthenticatedSession_1 = __importDefault(require("./isAuthenticatedSession"));
const cookies_1 = __importDefault(require("./storage/cookies"));
exports.defaultOptions = {
    jwt: true,
    isAuthenticated: false,
    refreshInterval: null,
    refreshFn: undefined,
    storage: cookies_1.default
};
const useSession = (partialOptions = {}) => {
    if (typeof partialOptions !== "object") {
        throw new Error("Invalid option passed to useSession");
    }
    let options = Object.assign({}, exports.defaultOptions, partialOptions);
    options = Object.assign({}, options.storage.get(options.req), options);
    const computedValues = getComputedValues_1.default(options, options);
    options = Object.assign({}, options, computedValues);
    options.storage.set(options, options.expiration);
    const [state, setState] = react_1.useState(options);
    const [errorMessage, setErrorMessage] = react_1.useState(options.errorMessage);
    const setSession = (newState) => {
        const mergedState = getComputedValues_1.default(Object.assign({}, state, newState), options);
        const { accessToken, isAuthenticated, expiration, idToken, refreshToken, storage, token } = mergedState;
        if (isAuthenticated) {
            storage.set({ accessToken, idToken, refreshToken, token }, expiration);
            setState(mergedState);
        }
        else {
            setState(Object.assign({}, mergedState, { expiration: undefined, isAuthenticated: false, accessToken: undefined, idToken: undefined, refreshToken: undefined, token: undefined }));
        }
    };
    const removeSession = () => {
        window.localStorage.setItem("logout", Date.now().toString());
        setSession({
            expiration: undefined,
            accessToken: undefined,
            idToken: undefined,
            refreshToken: undefined,
            token: undefined,
            profile: undefined
        });
        state.storage.remove();
    };
    const clearErrorMessage = () => setErrorMessage(undefined);
    /**
     * Global logout/login
     */
    react_1.useEffect(() => {
        const logoutEvent = (event) => {
            if (event.key === "logout") {
                removeSession();
            }
            if (options.jwt && event.key === "login") {
                setSession(state.storage.get());
            }
        };
        window.addEventListener("storage", logoutEvent);
        return () => {
            window.localStorage.removeItem("logout");
            window.localStorage.removeItem("login");
            window.removeEventListener("storage", logoutEvent);
        };
    }, []);
    const { expiration, refreshFn, refreshInterval, isAuthenticated } = state;
    /***
     * Remove Session Timer
     */
    const sessionExpiresIn = expiration && isAuthenticated
        ? // Need to cap at max 32-bit Int
            Math.min(2147483647, expiration.valueOf() - Date.now())
        : null;
    useInterval_1.default(() => removeSession(), sessionExpiresIn);
    /***
     * RefreshFn timer
     */
    let refreshExpiresIn;
    if (refreshFn && isAuthenticated) {
        refreshExpiresIn = Math.min(refreshInterval, sessionExpiresIn || Infinity);
    }
    else {
        refreshExpiresIn = null;
    }
    useInterval_1.default(() => __awaiter(this, void 0, void 0, function* () {
        setSession(yield refreshFn(state));
    }), refreshExpiresIn);
    return Object.assign({}, state, { setSession,
        removeSession,
        errorMessage,
        setErrorMessage,
        clearErrorMessage,
        isAuthenticatedGuard() {
            return isAuthenticatedSession_1.default(this);
        } });
};
exports.default = useSession;
//# sourceMappingURL=useSession.js.map