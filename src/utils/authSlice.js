import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import { authApi } from "./authApi";
import { sessionRefreshed, sessionExpired } from "./apiSlice";

/* ---------------------------------------------------------------
   Auth state

   The signed-in user, as the rest of the UI reads it. Nothing here
   is written by components directly: every change is the result of
   an API call, picked up by the matchers below.

   status:
     checking      — startup /auth/me in flight; don't redirect yet
     authenticated — user is set
     anonymous     — no session (never had one, logged out, expired)
----------------------------------------------------------------*/

const { getMe, login, signup, logout } = authApi.endpoints;

const signedIn = (state, action) => {
  state.user = action.payload;
  state.status = "authenticated";
};

const signedOut = (state) => {
  state.user = null;
  state.status = "anonymous";
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    status: "checking",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sessionRefreshed, signedIn)
      .addCase(sessionExpired, signedOut)
      .addMatcher(
        isAnyOf(getMe.matchFulfilled, login.matchFulfilled, signup.matchFulfilled),
        signedIn,
      )
      .addMatcher(getMe.matchRejected, signedOut)
      // Even if the logout request fails, the user asked to be out.
      .addMatcher(isAnyOf(logout.matchFulfilled, logout.matchRejected), signedOut);
  },
});

/* ---------------------------------- selectors */

export const selectCurrentUser = (store) => store.auth.user;
export const selectAuthStatus = (store) => store.auth.status;

export default authSlice.reducer;
