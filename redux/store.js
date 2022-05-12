import { configureStore } from "@reduxjs/toolkit";
import global from "./features/generalSlice";
import AuthReducer from "./features/authSlice";
import userRatingSlice from "./features/userRatingSlice";
import movieSlice from "./features/movieSlice";
import userHistorySlice from "./features/userHistorySlice";

export default configureStore({
  reducer: {
    global: global,
    userAuth: AuthReducer,
    userRatings: userRatingSlice,
    movie: movieSlice,
    userHistory: userHistorySlice,
  },
  devTools: process.env.NEXT_PUBLIC_DEVTOOL
    ? process.env.NEXT_PUBLIC_DEVTOOL
    : false,
});
