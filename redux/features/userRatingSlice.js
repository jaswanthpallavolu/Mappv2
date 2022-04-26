import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//add userMovie data
export const addMovieData = createAsyncThunk(
  "userData/addMovie",
  async (obj, thunkAPI) => {
    var data;
    await axios
      .post(`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/add/movie`, obj)
      .then((res) => (data = res.data))
      .catch((err) => console.log(err));
    return data;
  }
);
//delete userMovie data
export const deleteMovieData = createAsyncThunk(
  "userData/deleteMovie",
  async ({ uid, mid }, thunkAPI) => {
    var data;
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/${uid}/movie/${mid}`
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => console.log(err));
    return data;
  }
);

//update userMovie data
export const updateMovieData = createAsyncThunk(
  "userData/updateMovie",
  async ({ uid, mid, data }) => {
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/${uid}/movie/${mid}`,
        data
      )
      .catch((err) => console.log(err));
  }
);

//fetch movie
export const getMovie = createAsyncThunk(
  "userData/getMovie",
  async (uid, mid) => {
    var data;
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/${uid}/movie/${mid}`
      )
      .then((res) => (data = res.data));
    return data;
  }
);

//fetch all userMovies
export const fetchMovies = createAsyncThunk(
  "userData/fetchall",
  async (uid) => {
    var data;
    await axios
      .get(`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/${uid}/movies`)
      .then((res) => (data = res.data));
    return data;
  }
);
const initialState = {
  movies: [],
  // myList: [],
  status: "idle",
  error: null,
};
const userRatings = createSlice({
  name: "userRatings",
  initialState,
  reducers: {
    setEmpty: (state) => {
      state.movies = [];
      state.status = "succeeded";
    },
    // reloadList: (state) => {
    //     state.myList = state.movies.filter(i => i.myList === true)
    //     state.status = 'listLoaded'
    // }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        // console.log(`fetched:${action.payload?.map(i => i.title)}`)
        state.movies = action.payload;
        state.status = "loaded";
      })

      .addCase(addMovieData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addMovieData.fulfilled, (state, action) => {
        // state.movies.push(action.payload)
        state.status = "succeeded";
      })

      .addCase(deleteMovieData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMovieData.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(updateMovieData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMovieData.fulfilled, (state, action) => {
        state.status = "succeeded";
      });
  },
});

export const { setEmpty } = userRatings.actions;
export default userRatings.reducer;
