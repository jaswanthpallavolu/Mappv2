import { configureStore } from '@reduxjs/toolkit'
import ThemeReducer from './features/themeSlice'
import AuthReducer from './features/authSlice'
import userDataSlice from './features/userDataSlice'
import movieSlice from './features/movieSlice'
export default configureStore({
    reducer: {
        theme: ThemeReducer,
        currentUser: AuthReducer,
        userData: userDataSlice,
        movie: movieSlice
    },
})