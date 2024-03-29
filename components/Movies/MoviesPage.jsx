import React, {useEffect, useState} from 'react'
import Card from '../card/Card'
import {Pagination, PaginationItem} from '@mui/material'
import filter_json from './filter.json'
import {FilterAltOutlined, SortOutlined} from '@mui/icons-material'
import {Loader1} from '../../utils/loaders/Loading'
import styles from '../../styles/Movies.module.css'
import {useSelector} from 'react-redux'
import axios from 'axios'
import FilterModal from './FilterModal'

export default function MoviePage() {
	const uid = useSelector((state) => state.userAuth.user.uid)
	const [modal, setModal] = useState(false)

	const [query, setQuery] = useState({})
	const [result, setResult] = useState(null)
	const [result_len, setResultLen] = useState(0)
	const [page, setPage] = useState(1)
	const moviesperpage = 24
	const [sortby, setSortby] = useState(['year', 0])
	const [loading, setLoading] = useState(true)

	const fetchFilterMovies = async (signal) => {
		setLoading(true)
		const final_query = query
		final_query.page = page
		final_query.nof = moviesperpage
		const s = sortby
		s[1] = parseInt(s[1])
		final_query['sort'] = s

		await axios
			.post(
				`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/filter/`,
				{
					query: final_query,
				},
				{signal},
			)
			.then((res) => {
				setResult(res.data.movies)
				setResultLen(res.data.total_movies)
				setLoading(false)
			})
			.catch((err) => console.log(err))
	}

	useEffect(() => {
		if (typeof window !== 'undefined') {
			const initalQuery = {
				genre: [],
				released: 2020,
				range: 3,
				sort: ['year', 0],
				page: 1,
				nof: 24,
			}

			var data = JSON?.parse(localStorage.getItem(`filter_${uid}`))
			if (!data) setQuery(initalQuery)
			else setQuery(data)
			// console.log(initalQuery, data);
		}
		// setQuery(
		//   typeof window !== "undefined"
		//     ? JSON.parse(JSON.stringify(localStorage.getItem(`filter_${uid}`))) ||
		//         initalQuery
		//     : true
		// );
	}, [uid])

	useEffect(() => {
		const controller = new AbortController()
		query && fetchFilterMovies(controller.signal)
		return () => controller.abort()
	}, [query, page, sortby]) //eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setPage(1)
	}, [query, sortby])

	useEffect(() => {
		if (window) {
			localStorage.setItem(`filter_${uid}`, JSON.stringify(query))
		}
		// else {
		//   return true;
		// }
	}, [uid, query])

	// console.log({ query, loading, len: result?.length });
	return (
		<>
			{query && (
				<>
					<OptionSection
						query={query}
						setModal={setModal}
						setSortby={setSortby}
						filter_json={filter_json}
					/>
					{loading ? (
						<div className={styles.loader}>
							<Loader1 />
						</div>
					) : (
						<ResultSection
							result={result}
							result_len={result_len}
							moviesperpage={moviesperpage}
							setPage={setPage}
							page={page}
							loading={loading}
						/>
					)}
					{modal && (
						<FilterModal
							setQuery={setQuery}
							setModal={setModal}
							query={query}
						/>
					)}
				</>
			)}
		</>
	)
}

export const ResultSection = ({
	result,
	result_len,
	moviesperpage,
	setPage,
	page,
	loading,
}) => {
	return (
		<>
			{result?.length > 0 ? (
				<>
					<div className={styles.page_back}>
						<Pagination
							count={Math.ceil(result_len / moviesperpage) || 0}
							onChange={(e, v) => setPage(v)}
							color={'secondary'}
							className={styles.pagination}
							renderItem={(item) => (
								<PaginationItem
									{...item}
									sx={{
										'&.Mui-selected': {
											backgroundColor: 'var(--secondary)',
											color: 'var(--light-color)',
										},
									}}
								/>
							)}
							page={page}
						/>
					</div>
					{!loading && (
						<div className={styles.movies}>
							{result
								? result.map((i) => (
										<Card id={i} size={'medium'} key={i} />
								  ))
								: ''}
						</div>
					)}
					<div className={styles.page_back}>
						<Pagination
							count={Math.ceil(result_len / moviesperpage) || 0}
							onChange={(e, v) => setPage(v)}
							color={'secondary'}
							className={styles.pagination}
							renderItem={(item) => (
								<PaginationItem
									{...item}
									sx={{
										'&.Mui-selected': {
											backgroundColor: 'var(--secondary)',
										},
									}}
								/>
							)}
							page={page}
						/>
					</div>
				</>
			) : (
				<div className={styles.msg}>
					<h1>No Result Found</h1>
				</div>
			)}
		</>
	)
}

export const OptionSection = ({query, setModal, setSortby, filter_json}) => {
	return (
		<div className={styles.items}>
			<p className={styles.title}>
				{query?.genre?.length == 0 &&
				query?.released == 2020 &&
				query?.range == 3
					? 'All Movies'
					: 'Filtered Result'}
			</p>
			<div className={styles.options}>
				<button
					className={
						query.genre?.length == 0 &&
						query.released == 2020 &&
						query.range == 3
							? styles.filter_off
							: styles.filter
					}
					onClick={() => setModal(true)}
				>
					<FilterAltOutlined className={styles.icons} />
					Filter
				</button>
				<div className={styles.sort_content}>
					<SortOutlined className={styles.icons} />
					<select
						name="sort"
						className={styles.sort}
						onChange={(e) => setSortby(e.target.value.split(','))}
					>
						{filter_json['sortby'].map((i) => (
							<option
								value={Object.values(i)}
								key={Object.keys(i)}
							>
								{Object.keys(i)}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	)
}
