import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchNotifications = createAsyncThunk('allNotifs', async (uid) => {
	var data = []
	await axios
		.get(
			`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/notifications/getAll/${uid}`,
		)
		.then((res) => {
			data = res.data
			// console.log(data);
		})
		.catch((err) => {
			console.log(err)
		})
	return data
})

export const markAsRead = createAsyncThunk(
	'markAsRead',
	async ({uid, notifId}) => {
		await axios
			.put(
				`${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/notifications/markAsRead?uid=${uid}&notifId=${notifId}`,
			)
			.then((res) => {
				// console.log(res.data);
			})
			.catch((err) => {
				console.log(err)
			})
		// return data;
	},
)

const initialState = {
	notifications: [],
	status: 'idle',
}

const notificationSlice = createSlice({
	name: 'notifications',
	initialState,
	reducers: {
		addNotification: (state, action) => {
			// var isExist = state.notifications.filter(
			//   (n) => n._id === action.payload._id
			// ).length;
			// console.log("A-N", isExist);
			// if (!isExist)
			state.notifications = [...state.notifications, action.payload]
		},
		removeNotification: (state, action) => {
			const newNotifs = state.notifications.filter(
				(i) => i._id !== action.payload.id,
			)
			state.notifications = newNotifs
		},
		updateNotification: (state, action) => {
			var updatedList = state.notifications.map((i) => {
				if (i._id === action.payload._id) return action.payload
				return i
			})
			state.notifications = updatedList
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchNotifications.fulfilled, (state, action) => {
			state.notifications = action.payload
		})
	},
})

export const {addNotification, removeNotification, updateNotification} =
	notificationSlice.actions
export default notificationSlice.reducer
