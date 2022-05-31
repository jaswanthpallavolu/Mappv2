import { configureStore } from "@reduxjs/toolkit";
import global from "./features/generalSlice";
import AuthReducer from "./features/authSlice";
import userRatingSlice from "./features/userRatingSlice";
import userHistorySlice from "./features/userHistorySlice";
import peopleSlice from "./features/peopleSlice";
import notificationSlice from "./features/notificationSlice";

export default configureStore({
  reducer: {
    global: global,
    userAuth: AuthReducer,
    userRatings: userRatingSlice,

    userHistory: userHistorySlice,
    userNotifications: notificationSlice,
    people: peopleSlice,
  },
  devTools: process.env.NEXT_PUBLIC_DEVTOOL
    ? process.env.NEXT_PUBLIC_DEVTOOL
    : false,
});
