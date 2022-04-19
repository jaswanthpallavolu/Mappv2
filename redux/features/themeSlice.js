import { createSlice } from "@reduxjs/toolkit";

// const selected = window.localStorage.getItem('theme')
export const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        value: 'dark'
    },
    reducers: {
        toDark: (state) => {
            state.value = 'dark'
        },
        toLight: (state) => {
            state.value = 'light'
        },
        setTheme: (state, action) => {
            state.value = action.payload
        }
    }
})

export const { toDark, toLight, setTheme } = themeSlice.actions
export default themeSlice.reducer