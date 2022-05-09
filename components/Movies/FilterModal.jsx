import React, { useEffect, useState } from "react";
import styles from './modal.module.css'
import filter_json from './filter.json'

export default function FilterModal({setQuery,setModal,query}){
    const [year,setyear] = useState(query["released"])
    const [rate,setrate] = useState(query["range"])
    const [genre,setGenre] = useState(query["genre"] || [])

    const handlefilter = (e)=>{
        if (e.target.name=="year") setyear(e.target.value)
        if (e.target.name=="rate") setrate(e.target.value)
    }

    const handleGenre = (e)=>{
        if (genre.includes(e.target.value)){
            setGenre(genre.filter(i=>i!==e.target.value))
        }
        else{
            setGenre([...genre,e.target.value])
        }
    }

    const handleapply = ()=>{
        const query = {"genre":genre,"released":parseInt(year) || 2020,"range":parseInt(rate) || 3,"sort":["year",0],"page":1,"nof":20}
        setQuery(query)
        setModal(false)
        document.body.style.overflow = 'auto'
    }

    const handleclear = ()=>{
        setyear()
        setGenre([])
        setrate()
    }
    useEffect(()=>{
        document.body.style.overflow = 'hidden'
    },[])

    return(
    <div className={styles.modal_back}>
        <div className={styles.modal}>
            <div className={styles.callout}>
                <button className={styles.close_button} aria-label="Close alert" type="button" onClick={()=>{setModal(false);document.body.style.overflow = 'auto'}}>
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div className={styles.category}>
                <p>Released :</p>
                <form onChange={handlefilter}>
                    {filter_json['released'].map(i=>
                        <div className={styles.option} key={Object.keys(i)}>
                        <input type='radio' name="year" value={Object.values(i)} checked={Object.values(i)==year} onChange={()=>{}}/>
                        <span>{Object.keys(i)}</span>
                        </div>
                    )}
                </form>
            </div>
            <div className={styles.category}>
                <p>Rating :</p>
                <form onChange={handlefilter}>
                    {filter_json['rating'].map(i=>
                        <div className={styles.option} key={Object.keys(i)}>
                        <input type='radio' name="rate" value={Object.values(i)} checked={Object.values(i)==rate} onChange={()=>{}}/>
                        <span>{Object.keys(i)}</span>
                        </div>
                    )}
                </form>
            </div>
            <div className={styles.category}>
                <p>Genres :</p>
                <div className={styles.options}>
                    {filter_json['genres'].map(i=><button className={genre.includes(i) ? styles.active : styles.optionsbutton} onClick={handleGenre} value={i} key={i}>{i}</button>)}
                </div>
            </div>
            <div className={styles.btns}>
                <button className={styles.apply} onClick={handleclear}>Clear</button>
                <button className={styles.apply} onClick={handleapply}>Apply</button>
            </div>
        </div>
    </div>
    )
}
