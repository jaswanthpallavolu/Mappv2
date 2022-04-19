import React from 'react'
import styles from './cast.module.css'

export default function CastAndCrew({ leads, directors }) {
    return (
        <div className={styles.cc_section} >
            {leads?.map(actor => (
                <Cast key={Math.round() * 1000} name={actor.name} nmId={actor.id} />
            ))}
            {directors?.map(direc => (
                <Director key={Math.round() * 1000} name={direc.name} nmId={direc.id} />
            ))}
        </div>
    )
}

export function Cast({ name, nmId }) {
    return (
        <div className={styles.cast} onClick={() => window.open(`https://www.imdb.com/name/${nmId}/`)}>
            <img src="https://t3.ftcdn.net/jpg/01/65/63/94/360_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg" alt="" />
            <div className={styles.name}  >{name}</div>
            <div className={styles.role}>Cast</div>
        </div>
    )
}

export function Director({ name, nmId }) {
    return (
        <div className={styles.director} onClick={() => window.open(`https://www.imdb.com/name/${nmId}/`)} >
            <img src="https://t3.ftcdn.net/jpg/01/65/63/94/360_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg" alt="" />
            <div className={styles.name}  >{name}</div>
            <div className={styles.role}>Director</div>
        </div>
    )
}
