import { configureStore } from "@reduxjs/toolkit";
import ThemeReducer from "./features/themeSlice";
import AuthReducer from "./features/authSlice";
import userRatingSlice from "./features/userRatingSlice";
import movieSlice from "./features/movieSlice";
export default configureStore({
  reducer: {
    theme: ThemeReducer,
    userAuth: AuthReducer,
    userRatings: userRatingSlice,
    movie: movieSlice,
  },
});
