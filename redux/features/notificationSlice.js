import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  status: "idle",
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
