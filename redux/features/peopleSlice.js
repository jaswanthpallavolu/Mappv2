import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFriends = createAsyncThunk("fetchFriends", async (uid) => {
  var data = [];
  await axios
    .get(
      `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/friends/details?uid=${uid}`
    )
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
  return data;
});
export const searchUsers = createAsyncThunk(
  "searchUsers",
  async ({name, uid}) => {
    var data = [];
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/friends/search?word=${name}&uid=${uid}`
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => {
        console.log(err);
      });
    return data;
  }
);

const initialState = {
  friends: [],
  sentRequests: [],
  receivedRequests: [],
  status: "idle",
};

const people = createSlice({
  name: "people",
  initialState,

  reducers: {
    setFriends: (state, action) => {
      state.friends = action.payload;
    },
    setSentRequest: (state, action) => {
      state.sentRequests = action.payload;
    },
    setReceivedRequest: (state, action) => {
      state.receivedRequests = action.payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      if (action.payload?.username) {
        state.friends = action.payload.friends;
        state.sentRequests = action.payload?.sentRequests;
        state.receivedRequests = action.payload?.receivedRequests;
      }
    }),
      builder.addCase(searchUsers.pending, (state) => {
        state.status = "users-fetching";
      }),
      builder.addCase(searchUsers.fulfilled, (state) => {
        state.status = "users-fetch-complete";
      });
  },
});

export const { setFriends, setSentRequest, setReceivedRequest } =
  people.actions;
export default people.reducer;
