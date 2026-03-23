import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    cart: null   // ← change [] to null so cart?.items works correctly
  },
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    clearCartState: (state) => {
      state.cart = null;  // ← this is what Cart.jsx calls on "Clear All"
    }
  }
});

export const { setProduct, setCart, clearCartState } = productSlice.actions;
export default productSlice.reducer;