import React from 'react'
import styles from '../../styles/Home.module.css'

import styles2 from '../../styles/customstyles.module.css'

function Features() {
	const featurelist = [
		{
			id: '1',
			icon: 'fa-solid fa-film',
			name: 'Recommedation System',
			description: 'Both content based and collaborative filtering.',
		},
		{
			id: '2',
			icon: 'fa-solid fa-clapperboard',
			name: 'Personalized',
			description: 'Personalized home page based on user activity.',
		},
		{
			id: '3',
			icon: 'fa-solid fa-handshake',
			name: 'Stay Connected ',
			description: 'Connect with your friends and add new friends.',
		},
		{
			id: '4',
			icon: 'fa-solid fa-arrow-up-right-from-square',
			name: 'Suggestions',
			description:
				'suggest movies to your friends / get suggestions from them',
		},
	]

	return (
		<div className={`${styles.features} ${styles2.custom_scrollbar}`}>
			{featurelist.map((f, index) => (
				<Feature key={index} info={f} />
			))}
		</div>
	)
}

function Feature(props) {
	const {info} = props

	return (
		<div className={styles.feature}>
			<div className={styles.row}>
				<i className={info.icon}></i>
				<h3>{info.name}</h3>
			</div>
			<p>{info.description}</p>
		</div>
	)
}
export default Features
