import { configureStore } from "@reduxjs/toolkit";
import global from "./features/generalSlice";
import AuthReducer from "./features/authSlice";
import userRatingSlice from "./features/userRatingSlice";
import movieSlice from "./features/movieSlice";
export default configureStore({
  reducer: {
    global: global,
    userAuth: AuthReducer,
    userRatings: userRatingSlice,
    movie: movieSlice,
  },
});
