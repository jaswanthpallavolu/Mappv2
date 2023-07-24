import React, {useState, useEffect} from 'react'
import {useSelector} from 'react-redux'

import Carousel from '../carousel/Carousel'
import styles from './mylist.module.css'

export default function MyList() {
	const [myList, setMyList] = useState()
	const movies = useSelector((state) => state.userRatings.movies)

	useEffect(() => {
		var list = movies.filter((i) => i.myList === true)
		list = list?.map((i) => i.movieId)?.reverse()
		if (JSON.stringify(list) !== JSON.stringify(myList)) setMyList(list)
	}, [movies.filter((i) => i.myList === true)]) //eslint-disable-line react-hooks/exhaustive-deps

	return (
		<>
			{myList?.length > 0 ? (
				<div className={styles.mylist}>
					<div className={styles.head}>
						<span></span>
						<div className={styles.name}>my list</div>
					</div>
					<div>
						<Carousel list={myList} key={myList.length} />
					</div>
				</div>
			) : (
				<div className={styles.emptyList}>
					<p className={styles.suggest_text}>MyList is Empty</p>
				</div>
			)}
		</>
	)
}
