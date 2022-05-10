import React, { useState, useEffect } from "react";
import styles from "./card.module.css";
import axios from "axios";
// import styled from "styled-components";
import Skeleton from "../../utils/skeleton/Skeleton";
// import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import {
  addMovieData,
  deleteMovieData,
  updateMovieData,
} from "../../redux/features/userRatingSlice";
// import { setOpen, setMovieDetails } from "../../redux/features/movieSlice";
import { useRouter } from "next/router";

export default function Card({ id, size }) {
  const router = useRouter();

  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(true);

  const fetchMovie = async (signal) => {
    setLoading(true);
    await axios
      .get(`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/info/${id}`, {
        signal: signal,
      })
      .then((data) => {
        const res = data.data;
        setDetails(res.details);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    // if (status === 'succeeded') {
    fetchMovie(signal);

    // }
    return () => {
      controller.abort();
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  function GetPoster(details) {
    if (details.poster1 !== "") return details.poster1;
    else if (details.poster2 !== "") return details.poster2;
    else if (details?.small_Image !== "") return details?.small_Image;
    else return details.largeImage;
  }
  return (
    <div
      className={`${styles.m_card} ${size === "small" ? styles.small : ""}  ${
        size === "medium" ? styles.medium : ""
      } ${!size || size === "large" ? styles.large : ""}`}
      id="movie_card"
    >
      {!loading && details ? (
        <>
          <div className={styles.image}>
            {/* <Image objectFit='cover' layout='fill' className={styles.poster} src={details.poster} priority alt="name1" /> */}

            {GetPoster(details) !== "" ? (
              <img
                className={styles.poster}
                src={GetPoster(details)}
                alt={details.title}
              />
            ) : (
              <div className={styles.title_block}>{details.title}</div>
            )}
          </div>
          <Header details={details} />
          <div
            className={styles.info}
            onClick={() => {
              router.push(
                `/movies/${details.movieId}?movie=${details.title.replaceAll(
                  " ",
                  "-"
                )}&year=${details.year}`
              );
            }}
          >
            <div className={`${styles.title}`}>
              {String(details.title).substring(0, 50)}
            </div>
            <div className={styles.more}>
              <div className={styles.durt}>{details.runtime}</div>
              <span></span>
              {/* 
                        <div className={styles.rate}>{details.Rated}</div>
              <span></span> */}
              <div className={styles.year}>{details.year}</div>
            </div>
          </div>
          {/* <div className="details">View</div> */}
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
}

// this component handles all logic of add to/remove from  mylist operations
export const Header = ({ details }) => {
  const dispatch = useDispatch();
  const [inList, setInList] = useState();
  const uid = useSelector((state) => state.userAuth.user.uid);
  const movies = useSelector((state) => state.userRatings.movies);
  const [myList, setMyList] = useState([]);
  const loadStatus = useSelector((state) => state.userRatings.status);
  const authorized = useSelector((state) => state.userAuth.user.authorized);

  useEffect(() => {
    if (loadStatus !== "loading") {
      // setTimeout(() => {
      var list = movies.filter((i) => i.myList === true);
      // setMyList(list);
      if (JSON.stringify(list) !== JSON.stringify(myList)) setMyList(list);
      // }, 100);
    }
  }, [loadStatus]); //eslint-disable-line react-hooks/exhaustive-deps

  // const [status, setStatus] = useState(false);
  const checkCard = async () => {
    const mIfo = await myList.find((i) => i.movieId === details.movieId);
    if (mIfo) {
      setInList(mIfo.myList);
    } else {
      setInList(false);
    }
    // setStatus(false);
  };

  useEffect(() => {
    if (details?.movieId && authorized) checkCard(); //check whether it is in mylist
  }, [myList]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = () => {
    setInList(true);
    // setStatus(true);

    var obj = {
      uid: uid,
      movieId: details.movieId,
      title: details.title,
      liked: 0,
      watched: false,
      myList: true,
    };
    const mIfo = myList.find((i) => i.movieId === details.movieId);
    if (!mIfo) dispatch(addMovieData(obj));
    // else if (mIfo?.myList === true) {
    //   dispatch(
    //     updateMovieData({
    //       uid,
    //       mid: details.movieId,
    //       data: { ...mIfo, myList: false },
    //     })
    //   );
    // }
    else
      dispatch(
        updateMovieData({
          uid,
          mid: details.movieId,
          data: { ...mIfo, myList: true },
        })
      );

    // console.log(`added:${obj.title}`);

    // setTimeout(() => { checkCard() }, 1000)
  };
  const handleDelete = async () => {
    setInList(false);
    // setStatus(true);

    const mIfo = myList.find((i) => i.movieId === details.movieId);
    if (mIfo?.liked === 0 && !mIfo.watched)
      dispatch(deleteMovieData({ uid, mid: details.movieId }));
    // need to improve
    //   else if (mIfo?.myList === false) {
    //   dispatch(
    //     updateMovieData({
    //       uid,
    //       mid: details.movieId,
    //       data: { ...mIfo, myList: true },
    //     })
    //   );
    // }
    else
      dispatch(
        updateMovieData({
          uid,
          mid: details.movieId,
          data: { ...mIfo, myList: false },
        })
      );
  };
  return (
    <div className={styles.top}>
      <div className={styles.imdb}>
        {parseFloat(details.imdbRating).toFixed(1)}
      </div>
      <div className={styles.options}>
        {/* {!status ? (
          <> */}
        {inList ? (
          <div
            key={Math.random() * 999}
            title="remove from list"
            // className={styles.tooltip}
            onClick={() => authorized && handleDelete()}
            data-title="remove from list"
          >
            {/* <i className="fa-solid fa-bookmark"></i> */}
            {/* <img src="/assets/x-mark.png" alt="tick" /> */}
            <img src="/assets/bmark_selected.png" alt="tick" />
          </div>
        ) : (
          <div
            key={Math.random() * 999}
            title="add to list"
            // className={styles.tooltip}
            onClick={() => authorized && handleAdd()}
            data-title="add to list"
          >
            {/* <i className="fa-regular fa-bookmark"></i> */}
            {/* <img src="/assets/plus-circle-thin.png" alt="add" /> */}
            <img src="/assets/bookmark-thin.png" alt="add" />
          </div>
        )}
        {/* </>
        ) : (
          <div className={styles.spin}></div>
        )} */}
      </div>
    </div>
  );
};
