import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const app = firebase.initializeApp({
	apiKey: process.env.NEXT_PUBLIC_APIKEY,
	authDomain: `${process.env.NEXT_PUBLIC_PROJECTID}.firebaseapp.com`,
	projectId: process.env.NEXT_PUBLIC_PROJECTID,
	storageBucket: `${process.env.NEXT_PUBLIC_PROJECTID}.appspot.com`,
	messagingSenderId: process.env.NEXT_PUBLIC_MESSAGINGID,
	appId: process.env.NEXT_PUBLIC_APPID,
})

export const auth = app.auth()
export default app
