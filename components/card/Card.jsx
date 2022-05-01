import React, { useState, useEffect } from "react";
import styles from "./card.module.css";
import axios from "axios";
import styled from "styled-components";
import Skeleton from "../../utils/skeleton/Skeleton";
// import Image from "next/image";

import { useSelector, useDispatch } from "react-redux";
import {
  addMovieData,
  deleteMovieData,
  updateMovieData,
} from "../../redux/features/userRatingSlice";
import { setOpen, setMovieDetails } from "../../redux/features/movieSlice";
import { useRouter } from "next/router";

const MCard = styled.div.attrs((props) => ({
  className: `m_card ${props.size}`,
}))`
  ${(props) =>
    props.size === "large" &&
    `
    --card-width:15rem;
    --card-height:22rem;
    `}
  ${(props) =>
    props.size === "medium" &&
    `
    --card-width:12rem;
    --card-height:18rem;
    `}
    ${(props) =>
    props.size === "small" &&
    `
    --card-width:10rem;
    --card-height:15rem;
    `}
`;
export default function Card({ id, size }) {
  const router = useRouter();

  const [details, setDetais] = useState();
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  //   useEffect(() => {}, []);
  const fetchMovie = async (signal) => {
    setLoading(true);
    await axios
      .get(`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/info/${id}`, {
        signal: signal,
      })
      .then((data) => {
        const res = data.data;
        setDetais(res.details);
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
  return (
    <MCard className={styles.m_card} id="movie_card" size={size}>
      {!loading && details ? (
        <>
          <div className={styles.image}>
            {/* <Image objectFit='cover' layout='fill' className={styles.poster} src={details.poster} priority alt="name1" /> */}
            <img
              className={styles.poster}
              src={details?.poster1 ? details?.poster1 : details?.largeImage}
              alt={details.title}
            />
          </div>
          <Header details={details} />
          <div
            className={styles.info}
            onClick={() => {
              router.push(`/movies/${details.movieId}`);
              dispatch(setMovieDetails(details));
              dispatch(setOpen(true));
            }}
          >
            <div className={styles.title} id="card_title">
              {String(details.title).substring(0, 40)}
            </div>
            <div className={styles.more} id="card_more">
              <div className={styles.durt}>{details.runtime}</div>
              {/* <span></span>
                        <div className={styles.rate}>{details.Rated}</div> */}
              <span></span>
              <div className={styles.year}>{details.year}</div>
            </div>
          </div>
          {/* <div className="details">View</div> */}
        </>
      ) : (
        <Skeleton />
      )}
    </MCard>
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
      var list = movies.filter((i) => i.myList === true);
      //   list = list?.map((i) => i.movieId)?.reverse();
      if (JSON.stringify(list) !== JSON.stringify(myList)) setMyList(list);
    }
  }, [loadStatus]); //eslint-disable-line react-hooks/exhaustive-deps

  const [status, setStatus] = useState(false);
  const fix = async () => {
    const mIfo = await myList.find((i) => i.movieId === details.movieId);
    if (mIfo) {
      setInList(mIfo.myList);
    } else {
      setInList(false);
    }
    setStatus(false);
  };

  useEffect(() => {
    if (details?.movieId) fix();
  }, [myList, details]); //eslint-disable-line react-hooks/exhaustive-deps

  const handleAdd = () => {
    setStatus(true);
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
    else
      dispatch(
        updateMovieData({
          uid,
          mid: details.movieId,
          data: { ...mIfo, myList: true },
        })
      );
    // console.log(`added:${obj.title}`);

    // setTimeout(() => { fix() }, 1000)
  };
  const handleDelete = async () => {
    setStatus(true);
    const mIfo = await myList.find((i) => i.movieId === details.movieId);
    if (mIfo.liked === 0 && !mIfo.watched)
      dispatch(deleteMovieData({ uid, mid: details.movieId }));
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
        {!status ? (
          <>
            {inList ? (
              <div
                title="remove from list"
                // className={styles.tooltip}
                onClick={() => authorized && handleDelete()}
                data-title="remove from list"
              >
                <img src="/assets/x-mark.png" alt="tick" />
              </div>
            ) : (
              <div
                title="add to list"
                // className={styles.tooltip}
                onClick={() => authorized && handleAdd()}
                data-title="add to list"
              >
                <img src="/assets/plus-circle-thin.png" alt="add" />
              </div>
            )}
          </>
        ) : (
          <div className={styles.spin}></div>
        )}
      </div>
    </div>
  );
};
