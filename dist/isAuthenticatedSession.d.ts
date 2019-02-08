import { AuthenticatedSession, UseSession } from "./interfaces";
export default function isAuthenticated<TProfile>(session: UseSession<TProfile>): session is AuthenticatedSession<TProfile>;
//# sourceMappingURL=isAuthenticatedSession.d.ts.map