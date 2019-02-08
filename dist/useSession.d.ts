import { Profile, RequiredUseSessionOptions, UseSession } from "./interfaces";
export declare const defaultOptions: {
    jwt: boolean;
    isAuthenticated: boolean;
    refreshInterval: null;
    refreshFn: undefined;
    storage: {
        get: (req?: import("./interfaces").HttpReq | undefined) => import("./interfaces").Tokens;
        set: (tokens: import("./interfaces").Tokens, expires?: Date | undefined) => void;
        remove: () => void;
    };
};
declare const useSession: <TProfile = Profile>(partialOptions?: Partial<RequiredUseSessionOptions<TProfile>>) => UseSession<TProfile>;
export default useSession;
//# sourceMappingURL=useSession.d.ts.map