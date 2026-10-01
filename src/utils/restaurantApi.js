import { apiSlice } from "./apiSlice";
import fallbackMenus from "./fallbackRestaurantMenus.json";

/* ---------------------------------------------------------------
   Restaurant endpoints

   GET /restaurants/:id/menu answers
     { success, data: { restaurantId, isSample, menuOf, categories } }
   and the components receive `data` directly.

   `isSample` is true while the backend only holds one real menu: the
   dishes then belong to `menuOf`, not to the restaurant on screen.
----------------------------------------------------------------*/

// Menus rarely change; keep a visited menu cached for five minutes so
// going back and forth between restaurants does not refetch.
const MENU_CACHE_SECONDS = 300;

// Give up on a hung backend and use the fallback instead of spinning.
const MENU_TIMEOUT_MS = 8000;

/* ---------------------------------------------------------------
   TEMPORARY fallback — remove once the backend is deployed.

   fallbackRestaurantMenus.json is a copy of the backend's seed file
   (server/src/database/seed/restaurantMenus.json), and
   buildFallbackMenu() mirrors the backend's getRestaurantMenu(), so
   the page gets exactly the response the API would have sent.

   To remove: delete fallbackRestaurantMenus.json, the code in this
   block, and swap `queryFn` below for
     query: (id) => ({ url: menuUrl(id), timeout: MENU_TIMEOUT_MS }),
     transformResponse: (response) => response.data,
----------------------------------------------------------------*/

const SAMPLE_MENU_RESTAURANT_ID = "47120";

function buildFallbackMenu(restaurantId) {
  const byId = (id) => fallbackMenus.menus.find((m) => m.restaurant.id === id);
  const ownMenu = byId(restaurantId);
  const menu = ownMenu ?? byId(SAMPLE_MENU_RESTAURANT_ID);

  return {
    restaurantId,
    isSample: !ownMenu,
    menuOf: menu.restaurant,
    categories: menu.categories,
    // Not part of the API contract; lets the page (and you) tell the
    // copy from a live response while the fallback exists.
    isFallback: true,
  };
}

// The backend answered on purpose (bad id, no menu): show that, do not
// paper over it. Anything else — unreachable, timed out, 5xx, or a
// non-API page such as the host's 404 — means "backend not available".
const isDeliberateApiError = (error) =>
  typeof error.status === "number" &&
  error.status < 500 &&
  error.data?.success === false;

/* ---------------------------------------------- end TEMPORARY block */

const menuUrl = (restaurantId) =>
  `/restaurants/${encodeURIComponent(restaurantId)}/menu`;

export const restaurantApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getRestaurantMenu: build.query({
      async queryFn(restaurantId, _api, _extraOptions, baseQuery) {
        const result = await baseQuery({
          url: menuUrl(restaurantId),
          timeout: MENU_TIMEOUT_MS,
        });

        if (!result.error) return { data: result.data.data };
        if (isDeliberateApiError(result.error)) return { error: result.error };

        console.warn(
          "[menu] backend unavailable, using the bundled fallback menu",
          result.error.status,
        );
        return { data: buildFallbackMenu(restaurantId) };
      },
      keepUnusedDataFor: MENU_CACHE_SECONDS,
    }),
  }),
});

export const { useGetRestaurantMenuQuery } = restaurantApi;
