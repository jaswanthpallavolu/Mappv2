import React, { useState, useEffect, useLayoutEffect, useMemo } from "react";
import styles from "./card.module.css";
import _ from "lodash";
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
              <div className={styles.title_block}>
                {details.title} ({details.year})
              </div>
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
  // const [inList, setInList] = useState();
  const userId = useSelector((state) => state.userAuth.user.uid);
  const movies = useSelector((state) => state.userRatings.movies);
  // const [myList, setMyList] = useState([]);
  // const loadStatus = useSelector((state) => state.userRatings.status);
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  const [toggleIcon, setToggleIcon] = useState(null);

  useEffect(() => {
    // var list = movies.filter((i) => i.myList === true);

    // assignCardIcon(list);
    const timer = setTimeout(() => assignCardIcon(), 50);
    return () => clearTimeout(timer);
  }, [movies]); //eslint-disable-line react-hooks/exhaustive-deps

  const assignCardIcon = async () => {
    // console.log("checking status..");
    const mIfo = movies.find((i) => i.movieId === details.movieId);
    if (mIfo) {
      setToggleIcon(mIfo.myList);
    } else {
      setToggleIcon(false);
    }
  };

  const handleAdd = () => {
    setToggleIcon(true);
  };
  const handleRemove = async () => {
    setToggleIcon(false);
  };
  const handleMyListIcon = async () => {
    var mIfo = movies.find((i) => i.movieId === details.movieId);

    if (mIfo) {
      // var keys = Object.keys(obj);
      // mIfo = Object.entries(mIfo).filter(([key, value]) => {
      //   keys.includes(key);
      // });
      var { liked, movieId, watched, title, uid, myList } = mIfo;
      var newObj = {
        liked,
        movieId,
        watched,
        myList: toggleIcon,
        title,
        uid,
      };
      if (_.isEqual({ ...newObj, myList }, newObj)) {
        // console.log("no need of update");
        return;
      }
    }
    var initial = {
      uid: userId,
      movieId: details.movieId,
      title: details.title,
      liked: 0,
      watched: false,
      myList: false,
    };
    const isInitialObj = _.isEqual(initial, newObj);
    if (newObj && isInitialObj) {
      // console.log("delete the document");
      dispatch(deleteMovieData({ uid: userId, mid: details.movieId }));
    } else if (newObj && !isInitialObj) {
      // console.log("upd");
      dispatch(
        updateMovieData({
          uid: userId,
          mid: details.movieId,
          data: newObj,
        })
      );
    } else if (!newObj && toggleIcon) {
      // console.log("add");
      dispatch(addMovieData({ ...initial, myList: toggleIcon }));
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => handleMyListIcon(), 450);
    return () => clearTimeout(timer);
  }, [toggleIcon]);

  return (
    <div className={styles.top}>
      <div className={styles.imdb}>
        {parseFloat(details.imdbRating).toFixed(1)}
      </div>
      <div className={styles.options}>
        {/* {!status ? (
          <> */}
        {toggleIcon ? (
          <div
            // key={Math.random() * 999}
            title="remove from list"
            id="mylist-action"
            // className={styles.tooltip}
            onClick={() => authorized && handleRemove()}
            data-title="remove from list"
            data-id={details.movieId}
          >
            {/* <ion-icon name="bookmark"></ion-icon> */}
            {/* <i className="fa-solid fa-bookmark"></i> */}
            {/* <img src="/assets/x-mark.png" alt="tick" /> */}
            <img src="/assets/bmark_selected.png" alt="tick" />
          </div>
        ) : (
          <div
            // key={Math.random() * 999}
            title="add to list"
            // id="mylist-action"
            // className={styles.tooltip}
            onClick={() => authorized && handleAdd()}
            data-title="add to list"
          >
            {/* <ion-icon name="bookmark-outline"></ion-icon> */}
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
