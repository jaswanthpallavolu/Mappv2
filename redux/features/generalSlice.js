import { createSlice } from "@reduxjs/toolkit";

// const selected = window.localStorage.getItem('theme')
export const generalSlice = createSlice({
  name: "theme",
  initialState: {
    theme: "dark",

    //  for movie page

    showSuggestBox: false,
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
    setSuggestBox: (state) => {
      state.showSuggestBox = !state.showSuggestBox;
    },
  },
});

export const { toDark, toLight, setTheme, setIsMobile, setSuggestBox } =
  generalSlice.actions;
export default generalSlice.reducer;
