import { createSlice } from "@reduxjs/toolkit";

/* ---------------------------------------------------------------
   Cart state

   One entry per dish, with a quantity on it — adding the same dish
   twice bumps `quantity` instead of pushing a duplicate row. The
   Swiggy item shape is flattened once here at add-time, so the UI
   never has to dig through card.info again.
----------------------------------------------------------------*/

const toCartItem = (payload) => {
  // accepts the raw Swiggy wrapper ({ card: { info } }), the menu's
  // already-normalised item, or a bare info object
  const info = payload?.card?.info ?? payload?.raw ?? payload ?? {};

  return {
    id: String(info.id ?? ""),
    name: info.name ?? "Item",
    description: info.description ?? "",
    imageId: info.imageId ?? null,
    isVeg: Boolean(info.isVeg),
    rating: info.ratings?.aggregatedRating?.rating ?? payload?.rating ?? null,
    // menus expose the price as `price` or `defaultPrice`, in paise
    pricePaise: info.price ?? info.defaultPrice ?? payload?.pricePaise ?? 0,
  };
};

// every mutating reducer takes either an id or a whole item
const readId = (payload) =>
  String(payload?.id ?? payload?.card?.info?.id ?? payload ?? "");

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addItem: {
      reducer(state, action) {
        const item = action.payload;
        const line = state.items.find((entry) => entry.id === item.id);

        if (line) line.quantity += 1;
        else state.items.push({ ...item, quantity: 1 });
      },
      prepare(payload) {
        return { payload: toCartItem(payload) };
      },
    },

    // one step down; the line disappears when the last one goes
    removeItem(state, action) {
      const id = readId(action.payload);
      const index = state.items.findIndex((entry) => entry.id === id);
      if (index === -1) return;

      if (state.items[index].quantity > 1) state.items[index].quantity -= 1;
      else state.items.splice(index, 1);
    },

    // drop the whole line regardless of quantity
    deleteItem(state, action) {
      const id = readId(action.payload);
      state.items = state.items.filter((entry) => entry.id !== id);
    },

    clearCart(state) {
      state.items = [];
    },
  },
});

/* ---------------------------------- selectors */

export const selectCartItems = (store) => store.cart.items;

// total number of dishes, not number of lines
export const selectCartCount = (store) =>
  store.cart.items.reduce((total, entry) => total + entry.quantity, 0);

export const selectCartTotalPaise = (store) =>
  store.cart.items.reduce(
    (total, entry) => total + entry.pricePaise * entry.quantity,
    0,
  );

export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
