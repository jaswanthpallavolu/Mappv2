import {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getAllUsers} from '../redux/features/peopleSlice'
import {fetchMovies, setEmpty} from '../redux/features/userRatingSlice'
import {fetchUserHistory} from '../redux/features/userHistorySlice'
import Navbar from './Navbar/Navbar'
import socket from '../socket.connect'
import {Notch} from '../pages/home'
import customeStyles from '../styles/customstyles.module.css'

export default function Layout({children}) {
	const user = useSelector((state) => state.userAuth.user)
	const status = useSelector((state) => state.userAuth.status)

	const dispatch = useDispatch()

	useEffect(() => {
		if (status === 'idle' && user) {
			socket.emit('add-user', user.uid)
			socket.emit('get-online-users', user.uid)
			// dispatch(getAllUsers());
			dispatch(fetchMovies(user.uid))
			dispatch(fetchUserHistory(user.uid))
		}

		// if (status === "loggedout") {
		//   dispatch(setEmpty());
		// }
	}, [status, user]) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={customeStyles.main_scrollbar}>
			<Navbar />
			<Notch />
			{children}
		</div>
	)
}
