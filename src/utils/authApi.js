import { apiSlice } from "./apiSlice";

/* ---------------------------------------------------------------
   Auth endpoints

   Every response is { success, data: { user } }; transformResponse
   unwraps it so the hooks and authSlice matchers see the user object
   directly. The
   tokens themselves arrive as httpOnly cookies and never reach JS.
----------------------------------------------------------------*/

export const authApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query({
      query: () => "/auth/me",
      transformResponse: (response) => response.data.user,
    }),

    login: build.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => response.data.user,
    }),

    signup: build.mutation({
      query: (details) => ({
        url: "/auth/signup",
        method: "POST",
        body: details,
      }),
      transformResponse: (response) => response.data.user,
    }),

    logout: build.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      // Whatever the server said, drop every cached response: the next
      // user on this browser must not see the previous one's data.
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } finally {
          dispatch(apiSlice.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = authApi;
