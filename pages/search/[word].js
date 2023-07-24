import axios from 'axios'
import {useEffect, useState} from 'react'
import Layout from '../../components/Layout'
import styles from '../../styles/Search.module.css'
import Card from '../../components/card/Card'
import {useRouter} from 'next/router'
import {Loader1} from '../../utils/loaders/Loading'
import {useSelector} from 'react-redux'
import {Tag} from '../../components/Home_categories/category'
import LazyLoad from '../../utils/lazyLoad/LazyLoad'

function Search() {
	const theme = useSelector((state) => state.global.theme)
	const router = useRouter()
	const [pageCount, setPageCount] = useState()
	const {word} = router.query
	const [result, setResult] = useState([])
	const [loading, setLoading] = useState(true)

	// const user = useSelector((state) => state.userAuth.user.authenticated);
	// const status = useSelector((state) => state.userAuth.status);

	const getSearchResult = async (signal) => {
		await axios
			.get(
				`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/search/${word}`,
				{
					signal: signal,
				},
			)
			.then((res) => {
				setResult(res.data)
				setLoading(false)
			})
			.catch((err) => console.log(err))
		setPageCount(6)
	}

	useEffect(() => {
		const controller = new AbortController()
		const signal = controller.signal
		// window.localStorage.setItem("s-word", word);
		setLoading(true)
		getSearchResult(signal)

		return () => {
			controller.abort()
		}
	}, [word]) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<div
			className={`${styles.search_m} ${
				theme === 'light' ? styles.ltheme : styles.dtheme
			} `}
		>
			{loading ? (
				<div className={styles.load_bars}>
					<Loader1 />
				</div>
			) : (
				<>
					{result?.movies.length === 0 &&
					result?.tags.length === 0 ? (
						<div className={styles.msg}>
							<h2>
								<small>No Matches for</small> {word}
							</h2>
						</div>
					) : (
						<>
							<div className={styles.result_container}>
								<div className={styles.header}>
									<p>
										<small>search results for :</small>{' '}
										<b>{word}</b>
									</p>
								</div>
								{result?.movies?.length > 0 && (
									<>
										<div className={styles.content}>
											{result?.movies
												?.slice(0, pageCount)
												.map((id) => (
													<Card
														id={id}
														key={id}
														size="medium"
													/>
												))}
										</div>
										{pageCount < result?.movies?.length && (
											<div className={styles.moreMovies}>
												<button
													onClick={() =>
														setPageCount(
															pageCount + 5,
														)
													}
												>
													see More
												</button>
											</div>
										)}
									</>
								)}
								<div className={styles.tags}>
									{result?.tags?.map((tag, index) => (
										<LazyLoad key={index}>
											<Tag tagname={tag} />
										</LazyLoad>
									))}
								</div>
							</div>
						</>
					)}
				</>
			)}
		</div>
	)
}

Search.Layout = Layout

export default Search

// export const getServerSideProps = async (context) => {
//     var ids
//     await axios.get(`https://rsystem-l-2017-api.herokuapp.com/search/${context.params.word}`)
//         .then(data => { ids = data.data.result })

//     return {
//         props: {
//             ids
//         }
//     }
// }
