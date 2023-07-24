import React from 'react'
import styles from './loader.module.css'

export function Loader1() {
	return (
		<div className={styles.bars}>
			<span></span>
			<span></span>
			<span></span>
			<span></span>
		</div>
	)
}
