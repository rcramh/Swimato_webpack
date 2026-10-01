import { apiSlice } from "./apiSlice";

/* ---------------------------------------------------------------
   Restaurant endpoints

   GET /restaurants/:id/menu answers
     { success, data: { restaurantId, isSample, menuOf, categories } }
   and transformResponse hands the components `data` directly.

   `isSample` is true while the backend only holds one real menu: the
   dishes then belong to `menuOf`, not to the restaurant on screen.
----------------------------------------------------------------*/

// Menus rarely change; keep a visited menu cached for five minutes so
// going back and forth between restaurants does not refetch.
const MENU_CACHE_SECONDS = 300;

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getRestaurantMenu: build.query({
      query: (restaurantId) =>
        `/restaurants/${encodeURIComponent(restaurantId)}/menu`,
      transformResponse: (response) => response.data,
      keepUnusedDataFor: MENU_CACHE_SECONDS,
    }),
  }),
});

export const { useGetRestaurantMenuQuery } = restaurantApi;
