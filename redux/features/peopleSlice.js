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
  async ({ name, uid, signal }) => {
    var data = [];
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/friends/search?word=${name}&uid=${uid}`,
        { signal }
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

export const getUserDetails = createAsyncThunk(
  "fetchuserDetails",
  async (uid) => {
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
  }
);
//list all users
export const getAllUsers = createAsyncThunk("getallusers", async () => {
  var data;
  await axios
    .get(`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/all`)
    .then((res) => {
      data = res.data.users;
    })
    .catch((err) => console.log(err));
  return data;
});

const initialState = {
  friends: [],
  sentRequests: [],
  receivedRequests: [],
  allUsers: [],
  onlineUsers: [],
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
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },

  extraReducers(builder) {
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      if (action.payload?.username) {
        // console.log(action.payload);
        state.friends = action.payload.friends;
        state.sentRequests = action.payload?.sentRequests;
        state.receivedRequests = action.payload?.receivedRequests;
        state.status = "friends-fetched";
      }
    }),
      builder.addCase(getAllUsers.pending, (state) => {
        state.status = "loading";
      }),
      builder.addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.status = "all users fetched";
      }),
      builder.addCase(searchUsers.pending, (state) => {
        state.status = "loading";
      }),
      builder.addCase(searchUsers.fulfilled, (state) => {
        state.status = "users-fetch-complete";
      });
  },
});

export const {
  setFriends,
  setSentRequest,
  setReceivedRequest,
  setOnlineUsers,
} = people.actions;
export default people.reducer;
