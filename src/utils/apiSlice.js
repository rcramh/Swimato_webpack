import { createAction } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/* ---------------------------------------------------------------
   API client

   One RTK Query API for the whole app; feature files add endpoints
   to it with injectEndpoints. Auth lives entirely in httpOnly
   cookies, so there is no token here to read or attach:
   `credentials: "include"` has the browser send them itself.

   In development the CRA proxy (package.json "proxy") forwards /api
   to the Express server, so requests are same-origin. In production
   set REACT_APP_API_URL if the API is on another origin.
----------------------------------------------------------------*/

// Dispatched by the reauth wrapper; authSlice listens for both.
export const sessionRefreshed = createAction("auth/sessionRefreshed");
export const sessionExpired = createAction("auth/sessionExpired");

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL ?? "/api/v1",
  credentials: "include",
});

// A 401 from these means "wrong credentials" or "no session", never
// "access token expired" — refreshing would not help.
const SKIP_REAUTH = ["/auth/login", "/auth/signup", "/auth/refresh", "/auth/logout"];

// Shared by every request that hits a 401 while a refresh is in
// flight, so ten parallel calls cause one refresh, not ten.
let refreshInFlight = null;

const refreshSession = (api, extraOptions) => {
  refreshInFlight ??= rawBaseQuery(
    { url: "/auth/refresh", method: "POST" },
    api,
    extraOptions,
  ).finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
};

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  if (result.error?.status !== 401 || SKIP_REAUTH.includes(url)) return result;

  const refreshed = await refreshSession(api, extraOptions);

  if (refreshed.data) {
    api.dispatch(sessionRefreshed(refreshed.data.data.user));
    // New access cookie is set; the retry sends it automatically.
    return rawBaseQuery(args, api, extraOptions);
  }

  api.dispatch(sessionExpired());
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});

/* Turns an RTK Query error into something a form can show:
   { code, message, fieldErrors: { [field]: message }, requestId }.
   The server always answers
     { success: false, error: { code, message, details? }, requestId }
   (see the API's errorHandler.ts). Branch on `code`, not `message`. */
export function readApiError(error) {
  if (!error) return { code: null, message: "", fieldErrors: {}, requestId: null };

  if (error.status === "FETCH_ERROR") {
    return {
      code: "NETWORK_ERROR",
      message: "Can't reach the server. Check your connection and try again.",
      fieldErrors: {},
      requestId: null,
    };
  }

  const body = error.data?.error;
  const fieldErrors = {};
  (body?.details ?? []).forEach(({ field, message }) => {
    fieldErrors[field] ??= message;
  });

  return {
    code: body?.code ?? "UNKNOWN_ERROR",
    message: body?.message ?? "Something went wrong. Please try again.",
    fieldErrors,
    requestId: error.data?.requestId ?? null,
  };
}
