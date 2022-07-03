import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase_connect";
import { getAuth } from "firebase/auth";
import firebase from "@firebase/app-compat";
import axios from "axios";

export const checkUser = createAsyncThunk(
  "auth/checkUser",
  async (_, thunkAPI) => {
    var data;
    auth.onAuthStateChanged((user) => {
      console.log("chg: ", user);
      if (user) {
        data = {
          username: user.displayName,
          photoUrl: user.photoURL,
          email: user.email,
          uid: user.uid,
        };
        thunkAPI.dispatch(addToDB(data));
      }
      thunkAPI.dispatch(setCurrentUser(data));
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
  auth.signOut();
});

//add to database
export const addToDB = createAsyncThunk("auth/addUser", async (user) => {
  var data;
  await axios
    .post(`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/add`, user)
    .then((res) => {
      data = res.data;
      // console.log(data);
    })
    .catch((err) => console.log(err));
  return data;
});

const initialState = {
  user: {
    authorized: false,
  },
  status: "checking",
  error: null,
};
const Auth = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      if (action.payload?.username)
        state.user = { ...state.user, ...action.payload, auth: true };
      else {
        state.user = { auth: false };
        state.status = "not-loggedIn";
      }
      // state.status = "checked";
    },
    setUserStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder

      // .addCase(loginWithGoogle.pending, (state) => {
      //   state.status = "loading";
      // })
      // .addCase(loginWithGoogle.fulfilled, (state) => {
      //   state.status = "loaded";
      // })

      // .addCase(addToDB.pending, (state) => {
      //   state.status = "saving-user-details";
      // })
      .addCase(addToDB.fulfilled, (state, action) => {
        state.user = { ...action.payload, authorized: true };
        state.status = "idle";
      });
  },
});

export const { setCurrentUser, setUserStatus } = Auth.actions;
export default Auth.reducer;
