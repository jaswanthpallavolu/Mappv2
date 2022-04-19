import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// export const getMovieInfo = createAsyncThunk('movie/getMovieInfo', async ({ uid, mid }) => {
//     var data
//     await axios.get(`${process.env.NEXT_PUBLIC_DATA_SERVER}/user/${uid}/movie/${mid}`)
//         .then(res => data = res.data)
//     return data[0]
// })

export const getRecomendations = createAsyncThunk('movie/contentbased/', async ({ id }) => {
    var data
    await axios.get(`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/contentbased/${id}`)
        .then(res => { data = res.data.result })
        .catch(err => cosole.log(err))
    return data
})

const initialState = {
    details: {},
    recommends: [],
    open: false,
    status: 'idle'
}

const movie = createSlice({
    name: 'movie',
    initialState,
    reducers: {
        setOpen: (state, action) => {
            state.open = action.payload
        },
        setMovieDetails: (state, action) => {

            state.details = action.payload
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getRecomendations.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(getRecomendations.fulfilled, (state, action) => {
                state.recommends = action.payload
                state.status = 'succeeded'
            })
    }
})

export const { setOpen, setMovieDetails } = movie.actions
export default movie.reducer