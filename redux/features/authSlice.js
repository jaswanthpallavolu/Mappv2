import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase_connect";
import firebase from "@firebase/app-compat";
import axios from "axios";
export const checkUser = createAsyncThunk(
  "auth/checkUser",
  async (_, thunkAPI) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const data = {
          username: user.displayName,
          photoUrl: user.photoURL,
          email: user.email,
          uid: user.uid,
        };

        thunkAPI.dispatch(setCurrentUser(data));
      } else thunkAPI.dispatch(setCurrentUser(""));
      thunkAPI.dispatch(getAllUsers());
    });
  }
);

export const loginWithGoogle = createAsyncThunk(
  "auth/userLogin",
  (_, thunkAPI) => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth
      .signInWithRedirect(provider)
      // .signInWithPopup(provider)
      .then((userCred) => {})
      .catch((err) => console.log(err));
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  return auth.signOut();
});

//list all users
export const getAllUsers = createAsyncThunk("auth/allUsers", async () => {
  var data;
  await axios
    .get(`${process.env.NEXT_PUBLIC_DATA_SERVER}/user/all`)
    .then((res) => (data = res.data.users));
  return data;
});
//add to database
export const addToDB = createAsyncThunk("auth/addUser", async (user) => {
  await axios
    .post(`${process.env.NEXT_PUBLIC_DATA_SERVER}/user/add`, user)
    .then((res) => console.log("new User"));
});

const initialState = {
  user: {
    authorized: false,
  },
  status: "notloaded",
  error: null,
  all: [],
};
const Auth = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.user.authorized = true;
      }
    },
    setUserStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.pending, (state) => {
        state.user = { authorized: false };
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = { authorized: false };
        state.status = "done";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = "succeeded";
      })
      .addCase(addToDB.fulfilled, (state, action) => {
        state.all = action.payload;
        state.status = "idle";
      });
  },
});

export const { setCurrentUser, setUserStatus } = Auth.actions;
export default Auth.reducer;
