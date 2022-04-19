import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const app = firebase.initializeApp({
    apiKey: "AIzaSyA0EqLjFmzulGl0hwXyi6M2Yp0OoZIf_Xw",
    authDomain: "mrsystem-17d1b.firebaseapp.com",
    projectId: "mrsystem-17d1b",
    storageBucket: "mrsystem-17d1b.appspot.com",
    messagingSenderId: "549133703456",
    appId: "1:549133703456:web:2579d8beec9ce5ec999f45"
})

export const auth = app.auth()
export default app