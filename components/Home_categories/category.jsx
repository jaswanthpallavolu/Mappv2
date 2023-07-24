import Carousel from '../carousel/Carousel'
import {useRef, useEffect, useState} from 'react'
import {Loader1} from '../../utils/loaders/Loading'
import styles from './sections.module.css'
import {useSelector} from 'react-redux'
import axios from 'axios'

export function Recommend({name}) {
	const [loading, setLoading] = useState(false)
	const [queryList, setQueryList] = useState([])
	const [title, setTitle] = useState('Recommended for you')
	// const [rated, setRated] = useState();
	// const [watched, setWatched] = useState();
	const [result, setResult] = useState()
	const status = useSelector((state) => state.userRatings.status)
	const movies = useSelector((state) => state.userRatings.movies)
	const getRecommendations = async (signal) => {
		await axios
			.post(
				`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/collaborative/`,
				{
					movies: queryList,
				},
				{signal},
			)
			.then((res) => {
				setResult(res.data.result)
				// setLoading(false);
			})
			.catch((err) => console.log(err))
	}
	const getSimilar = async (signal) => {
		// console.log("collab");
		if (window.innerWidth > 600)
			setTitle(`because you watched, ${queryList[0][1]}`)
		else setTitle(`you watched, ${queryList[0][1]}`)
		var id = queryList[0][0]
		await axios
			.get(
				`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/contentbased/${id}`,
				{signal},
			)
			.then((res) => {
				setResult(res.data.result)
				// setLoading(false);
			})
			.catch((err) => console.log(err))
	}

	const recommendMovies = (signal) => {
		if (queryList.length) {
			// setLoading(true);
			if (name === 'collaborative') getRecommendations(signal)
			else if (name === 'watched') getSimilar(signal)
			// }
		} else {
			setResult([])
			// setLoading(false);
		}
	}
	useEffect(() => {
		const controller = new AbortController()
		if (queryList) recommendMovies(controller.signal)
		return () => controller.abort()
	}, [queryList]) //eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		// if (status !== "loading" && status) {
		if (name === 'collaborative') {
			var mlist = movies.filter((i) => i.liked != 0)
			mlist = mlist.map((i) => [i.movieId, i.liked])
			// console.log(mlist);
		}
		if (name === 'watched') {
			var mlist = movies.filter((i) => i.watched)
			mlist = mlist.map((i) => [i.movieId, i.title]).reverse()
		}

		if (JSON.stringify(queryList) !== JSON.stringify(mlist))
			setQueryList(mlist)
		// }
	}, [movies]) //eslint-disable-line react-hooks/exhaustive-deps
	return (
		<>
			{result?.length ? (
				<div className={styles.c_section}>
					<div className={styles.head}>
						<div className={styles.name}>{title}</div>
					</div>
					<Carousel list={result} key={result?.length} />
					{/* {!loading ? (
            <Carousel list={result} />
          ) : (
            <div
              style={{
                height: "20vh",
                display: "grid",
                placeItems: "center",
                alignItems: "center",
              }}
            >
              <Loader1 />
            </div>
          )} */}
				</div>
			) : (
				''
			)}

			{!result?.length && name === 'collaborative' ? (
				<p className={styles.suggest_text}>
					&quot; like <i className="far fa-thumbs-up"></i> movies to
					get Recommendations &quot;
				</p>
			) : (
				''
			)}
		</>
	)
}

export function CategoryTemplate({name, list}) {
	return (
		<div className={styles.c_section}>
			<div className={styles.head}>
				<div className={styles.name}>{name}</div>
			</div>
			<Carousel list={list} />
		</div>
	)
}

export const Tag = ({tagname}) => {
	// const status = useSelector((state) => state.userRatings.status);
	// const movies = useSelector((state) => state.userRatings.movies);

	const [loading, setLoading] = useState(true)
	const [result, setResult] = useState([])

	const fetchMoviesByTag = async (signal) => {
		const url = `${
			process.env.NEXT_PUBLIC_MOVIE_SERVER
		}/movies/tags/${tagname.replace(' ', '+')}`

		await axios
			.get(url, {signal})
			.then((res) => {
				setResult(res.data.movies)
				setLoading(false)
			})
			.catch((err) => {
				console.log(err)
				setLoading(false)
			})
	}

	useEffect(() => {
		const controller = new AbortController()
		const signal = controller.signal

		fetchMoviesByTag(signal)

		return () => controller.abort()
	}, []) //eslint-disable-line react-hooks/exhaustive-deps
	// list={result?.sort(() => .5 - Math.random())}

	return (
		<>
			{result?.length ? (
				<div className={styles.c_section}>
					<div className={styles.head}>
						<div className={styles.name}>{tagname}</div>
					</div>
					{!loading ? (
						<Carousel list={result} />
					) : (
						<div
							style={{
								height: '20vh',
								display: 'grid',
								placeItems: 'center',
								alignItems: 'center',
							}}
						>
							<Loader1 />
						</div>
					)}
				</div>
			) : (
				''
			)}
		</>
	)
}

export const Category = ({name}) => {
	const status = useSelector((state) => state.userRatings.status)
	const movies = useSelector((state) => state.userRatings.movies)
	const uid = useSelector((state) => state.userAuth.user.uid)
	// const user.authorized = useSelector((state) => state.userAuth.user.user.authorized);

	const [loading, setLoading] = useState(true)
	const [result, setResult] = useState()
	const mountedRef = useRef(true)

	const getLocalStorageMovies = () => {
		var mlist = []
		if (name === 'recently viewed') {
			window
				? (mlist = JSON.parse(localStorage.getItem(`recent_${uid}`)))
				: true

			mlist = mlist ? mlist['movies'] : []
			// console.log("rv2", mlist);
		}

		if (JSON.stringify(mlist) !== JSON.stringify(result)) {
			setResult(mlist)
			setLoading(true)
			setTimeout(() => {
				setLoading(false)
			}, 100)
		}
	}
	const getUserMovies = () => {
		var mlist = []
		if (name === 'rated movies') mlist = movies?.filter((i) => i.liked != 0)
		else if (name === 'watched') mlist = movies?.filter((i) => i.watched)
		mlist = mlist?.map((i) => [i.movieId]).reverse()
		if (JSON.stringify(mlist) !== JSON.stringify(result)) {
			setResult(mlist)
			setLoading(true)
			setTimeout(() => {
				setLoading(false)
			}, 100)
		}
		// setLoading(false);
	}

	useEffect(() => {
		if (
			status === 'loaded' &&
			mountedRef.current &&
			name &&
			name !== 'recently viewed'
		) {
			getUserMovies()
		}
	}, [status, uid]) //eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (name === 'recently viewed') getLocalStorageMovies()
	}, [uid]) //eslint-disable-line react-hooks/exhaustive-deps
	//clean up function
	useEffect(() => {
		return () => {
			mountedRef.current = false
		}
	}, [])

	return (
		<>
			{result?.length && !loading ? (
				<div className={styles.c_section}>
					<div className={styles.head}>
						{name === 'recently viewed' ? (
							<div className={styles.name}>
								{name}
								<p
									onClick={() => {
										window?.localStorage.removeItem(
											`recent_${uid}`,
										)
										getLocalStorageMovies()
									}}
								>
									clear
								</p>
							</div>
						) : (
							<p className={styles.name}>{name}</p>
						)}
					</div>
					{!loading ? (
						<Carousel list={result} />
					) : (
						<div
							style={{
								height: '20vh',
								display: 'grid',
								placeItems: 'center',
								alignItems: 'center',
							}}
						>
							<Loader1 />
						</div>
					)}
				</div>
			) : (
				''
			)}
		</>
	)
}
