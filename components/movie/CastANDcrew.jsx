import React from 'react'
import styles from './MovieDetails.module.css'

export default function CastANDcrew({actors, directors}) {
	return (
		<div className={styles.castcrew}>
			<ul>
				<li>
					<h6 className={styles.sec_header}>DIRECTOR</h6>
				</li>
				<li>
					<a
						href={`https://www.imdb.com/name/${directors[0]?.id}`}
						target="_blank"
						rel="noreferrer"
					>
						<h5 className={styles.sec_value}>
							{directors[0]?.name}
						</h5>
					</a>
				</li>
			</ul>
			<ul>
				<li>
					<h6 className={styles.sec_header}>CAST</h6>
				</li>

				{actors?.map((actor, index) => (
					<li key={index}>
						<a
							href={`https://www.imdb.com/name/${actor?.id}`}
							target="_blank"
							rel="noreferrer"
						>
							<h5 className={styles.sec_value} key={index}>
								{actor.name}
							</h5>
						</a>
					</li>
				))}
			</ul>
		</div>
	)
}
