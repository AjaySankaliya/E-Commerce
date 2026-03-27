import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: "Wishlist",
  initialState: {
    wishlists: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      state.wishlists = action.payload;
    },
    addToWishlistState: (state, action) => {
      if (!state.wishlists.find(item => item._id === action.payload._id)) {
        state.wishlists.push(action.payload);
      }
    },
    removeFromWishlistState: (state, action) => {
      state.wishlists = state.wishlists.filter(item => item._id !== action.payload);
    }
  }
});

export const { setWishlist, addToWishlistState, removeFromWishlistState } = wishlistSlice.actions;
export default wishlistSlice.reducer;
