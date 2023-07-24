import React, {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
import Layout from '../../components/Layout'
import MovieDetails from '../../components/movie/MovieDetails'
import styles from '../../styles/movie.module.css'
import {Loader1} from '../../utils/loaders/Loading'
import axios from 'axios'

export default function Movie() {
	const router = useRouter()
	const {id} = router.query
	const [details, setDetails] = useState()
	const [loading, setLoading] = useState(true)

	const fetchMovie = async (signal) => {
		setLoading(true)
		await axios
			.get(`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/info/${id}`, {
				signal: signal,
			})
			.then((data) => {
				const res = data.data
				setDetails(res?.details)
				setLoading(false)
			})
			.catch((err) => {
				console.log(err)
			})
	}

	useEffect(() => {
		const controller = new AbortController()
		const signal = controller.signal
		if (id) {
			fetchMovie(signal)
			// console.log("hello");
		}
		return () => {
			controller.abort()
		}
	}, [id]) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div className={styles.movie}>
			{!loading ? (
				<>
					{details ? (
						<MovieDetails details={details} />
					) : (
						<div className={styles.notfound}>
							<h2>Movie Not Found</h2>
						</div>
					)}
				</>
			) : (
				<div className={styles.notfound} />
			)}
		</div>
	)
}

// export const getServerSideProps = async (context) => {
//   const res = await fetch(
//     `https://django-movie-server.herokuapp.com/movies/info/${context.params.id}`
//   );
//   const movie = await res.json();
//   return {
//     props: { movie },
//   };
// };
Movie.Layout = Layout
