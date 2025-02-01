import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAdmin: false, // Default: user is not admin
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdmin(state, action) {
      state.isAdmin = action.payload; // Set isAdmin to true/false
    },
  },
});

export const { setAdmin } = adminSlice.actions;

export default adminSlice.reducer;
