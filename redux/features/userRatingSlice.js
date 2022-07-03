import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//add userMovie data
export const addMovieData = createAsyncThunk(
  "userData/addMovie",
  async ({ body, signal }, thunkAPI) => {
    var data;
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/add/movie`,
        body,
        { signal }
      )
      .then((res) => (data = res.data))
      .catch((err) => console.log(err));
    // console.log("ADD", data);
    return data;
  }
);
//delete userMovie data
export const deleteMovieData = createAsyncThunk(
  "userData/deleteMovie",
  async ({ uid, mid, signal }, thunkAPI) => {
    var data;
    await axios
      .delete(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/${uid}/movie/${mid}`,
        { signal }
      )
      .then((res) => {
        data = res.data;
      })
      .catch((err) => console.log(err));
    // console.log("DELETE", data);

    return data;
  }
);

//update userMovie data
export const updateMovieData = createAsyncThunk(
  "userData/updateMovie",
  async ({ uid, mid, body, signal }) => {
    var data;
    await axios
      .put(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/user/${uid}/movie/${mid}`,
        body,
        { signal }
      )
      .then((res) => (data = res.data))
      .catch((err) => console.log(err));
    // console.log("UPD", data);

    return data;
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
  "userData/fetchMovies",
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
        // console.log(action.payload);
        if (action?.payload?._id) {
          state.movies = [...state.movies, action.payload];
          state.status = "succeeded";
        }
      })

      .addCase(deleteMovieData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMovieData.fulfilled, (state, action) => {
        if (action?.payload?.movieId) {
          const result = state.movies.filter(
            (i) => i.movieId !== action.payload.movieId
          );
          state.movies = result;
          state.status = "succeeded";
        }
      })
      .addCase(updateMovieData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMovieData.fulfilled, (state, action) => {
        // console.log(action.payload);
        if (action?.payload?.movieId) {
          const result = state.movies.filter(
            (i) => i.movieId !== action.payload.movieId
          );
          const updatedList = [...result, action.payload];

          // var updatedList = state.movies?.map((i) => {
          //   if (i._id === action.payload._id) return action.payload;
          //   return i;
          // });
          //  ? updatedList : [{ ...action.payload }];
          state.movies = updatedList;
          state.status = "succeeded";
        }
      });
  },
});

export const { setEmpty } = userRatings.actions;
export default userRatings.reducer;
