import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchNotifications = createAsyncThunk("allNotifs", async (uid) => {
  var data = [];
  await axios
    .get(
      `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/notifications/getAll/${uid}`
    )
    .then((res) => {
      data = res.data;
      // console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
});

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
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});

export const { setNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
