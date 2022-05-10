import { createSlice } from "@reduxjs/toolkit";

// const selected = window.localStorage.getItem('theme')
export const generalSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "dark",
    isMobile: false,
  },
  reducers: {
    toDark: (state) => {
      state.theme = "dark";
    },
    toLight: (state) => {
      state.theme = "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { toDark, toLight, setTheme, setIsMobile } = generalSlice.actions;
export default generalSlice.reducer;
