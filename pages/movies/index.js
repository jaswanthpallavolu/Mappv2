import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import styles from "../../styles/Movies.module.css";
import { useRouter } from "next/router";
import FilterModal from "../../components/Movies/FilterModal";
import axios from "axios";
import Card from "../../components/card/Card";
import { Pagination, PaginationItem } from "@mui/material";
import filter_json from '../../components/Movies/filter.json'
import { FilterAltOutlined, SortOutlined } from "@mui/icons-material";
import { Loader1 } from "../../utils/loaders/Loading";

export default function Movies() {
  const router = useRouter();
  const [modal,setModal] = useState(false)
  const [query,setQuery] = useState({"genre":[],"released":2020,"range":3,"sort":["year",0],"page":1,"nof":24})
  const [result,setResult] = useState()
  const [result_len,setResultLen] = useState()
  const [page,setPage] = useState(1)
  const [moviesperpage,setMoviesperPage] = useState(24)
  const [sortby,setSortby] = useState(["year",0])
  const [loading,setLoading] = useState(false)

  const fetchFilterMovies = async()=>{
    setLoading(true)
    const final_query = query
    final_query["page"] = page
    final_query["nof"] = moviesperpage
    const s = sortby
    s[1] = parseInt(s[1])
    final_query["sort"] = s

    await axios.post(`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/filter/`,{"query":final_query}).then(res=>{setResult(res.data.movies);setResultLen(res.data.total_movies);setLoading(false)})
  }

  useEffect(()=>{
    fetchFilterMovies()
  },[query,page,sortby])

  useEffect(()=>{
    setPage(1)
  },[query,sortby])

  useEffect(()=>{
    document.body.style.overflow = 'auto';
  },[])

  return (
    <div className={styles.container}>
      <div className={styles.items}>
        <p className={styles.title}>{(query["genre"].length==0 && query["released"]==2020 && query["range"]==3) ? "All Movies" : "Filtered Result"}</p>
        <div className={styles.options}>
          <button className={(query["genre"].length==0 && query["released"]==2020 && query["range"]==3) ? styles.filter_off : styles.filter} onClick={()=>setModal(!modal)}><FilterAltOutlined className={styles.icons}/>Filter</button>
          <div className={styles.sort_content}>
          <SortOutlined className={styles.icons}/>
            <select name="sort" className={styles.sort} onChange={(e)=>setSortby((e.target.value).split(','))}>
              {filter_json["sortby"].map(i=><option value={Object.values(i)} key={Object.keys(i)}>{Object.keys(i)}</option>)}
            </select>
          </div>
        </div>
       </div>
      {loading ? <div className={styles.loader}><Loader1 /></div> : (<>
        {result?.length > 0 ?
          <>
            <div className={styles.page_back}>
              <Pagination count={Math.ceil(result_len/moviesperpage)} onChange={(e,v)=>setPage(v)} color={"secondary"}  className={styles.pagination} renderItem={(item)=>(
                <PaginationItem {...item}
                sx= {{"&.Mui-selected":{backgroundColor: "green"}}}
                />
              )} page={page}/>
            </div>
            {!loading ?
              <div className={styles.movies}>
                {result ? result.map(i=><Card id={i} size={"medium"} key={i}/>):""}
              </div>:""}
            <div className={styles.page_back}>
              <Pagination count={Math.ceil(result_len/moviesperpage)} onChange={(e,v)=>setPage(v)} color={"secondary"}  className={styles.pagination} renderItem={(item)=>(
                  <PaginationItem {...item}
                  sx= {{"&.Mui-selected":{backgroundColor: "green"}}}
                  />
                )} page={page}/>
            </div>
          </>:(
            <div className={styles.msg}>
              <h1>No Result Found</h1>
            </div>
          )}
        </>)}
        {modal ? <FilterModal setQuery={setQuery} setModal={setModal} query={query}/> : ""}
    </div>
  );
}

Movies.Layout = Layout;
