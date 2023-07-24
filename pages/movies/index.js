import React from 'react'
import Layout from '../../components/Layout'
import styles from '../../styles/Movies.module.css'
import MoviePage from '../../components/Movies/MoviesPage'
import {useSelector} from 'react-redux'

export default function Movies() {
	const theme = useSelector((state) => state.global.theme)

	return (
		<div
			className={`${styles.container} ${
				theme === 'light' ? styles.ltheme : styles.dtheme
			} `}
		>
			<MoviePage />
		</div>
	)
}

Movies.Layout = Layout
