import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../firebase_connect";
import firebase from "@firebase/app-compat";
import axios from "axios";

export const checkUser = createAsyncThunk(
  "auth/checkUser",
  async (_, thunkAPI) => {
    var data;
    auth.onAuthStateChanged((user) => {
      if (user) {
        data = {
          username: user.displayName,
          photoUrl: user.photoURL,
          email: user.email,
          uid: user.uid,
        };
        // console.log(data);
        thunkAPI.dispatch(setCurrentUser(data));
        thunkAPI.dispatch(addToDB(data));
      }
    });

    // return data;
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
  status: "notloaded",
  error: null,
};
const Auth = createSlice({
  name: "Auth",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      if (action.payload)
        state.user = { ...state.user, ...action.payload, auth: true };
      state.status = "suceeded";
    },
    setUserStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(checkUser.pending, (state) => {
        state.status = "saving-user-details";
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        // console.log(action.payload);
      })

      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.status = "loaded";
      })
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = { authorized: false };
        state.status = "loggedout";
      })

      .addCase(addToDB.pending, (state) => {
        state.status = "saving-user-details";
      })
      .addCase(addToDB.fulfilled, (state, action) => {
        state.user = { ...action.payload, authorized: true };
        state.status = "idle";
      });
  },
});

export const { setCurrentUser, setUserStatus } = Auth.actions;
export default Auth.reducer;
