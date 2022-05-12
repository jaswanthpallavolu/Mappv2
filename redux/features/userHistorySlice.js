import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const updateUserHistory = createAsyncThunk(
  "userhistory/update",
  async (body, thunkAPI) => {
    var history;
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/userhistory/update`,
        body
      )
      .then((res) => {
        history = res.data;
      })
      .catch((err) => console.log(err));
    return history;
  }
);

export const fetchUserHistory = createAsyncThunk(
  "userhistory/fetch",
  async (uid) => {
    var history;
    await axios
      .get(`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/userhistory/${uid}`)
      .then((res) => (history = res.data))
      .catch((err) => console.log(err));
    return history;
  }
);

const initialState = {
  history: {},
  status: "idle",
  error: null,
};

const userHistory = createSlice({
  name: "userHistory",
  initialState,
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(fetchUserHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.status = "loaded";
      })
      .addCase(updateUserHistory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUserHistory.fulfilled, (state, action) => {
        state.history = action.payload;
        state.status = "loaded";
      });
  },
});

export default userHistory.reducer;
