import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMovieData,
  deleteMovieData,
  addMovieData,
} from "../../redux/features/userRatingSlice";
import _ from "lodash";

import { updateUserHistory } from "../../redux/features/userHistorySlice";

import styles from "./MovieDetails.module.css";
import styles2 from "./moviemobile.module.css";
import CastANDcrew from "./CastANDcrew";
import SimilarMovies from "./SimilarMovies";
import TrailerModal from "./TrailerModal";

export default function MovieDetails({ details }) {
  const [openTrailer, setOpenTrailer] = useState(false);
  const [isMobile, setIsMobile] = useState();
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.userAuth.user.uid);
  const historyStatus = useSelector((state) => state.userHistory.status);
  const moviesVisited = useSelector(
    (state) => state.userHistory.history?.moviesVisited
  );
  const checkWidth = () => {
    if (window.innerWidth > 600) setIsMobile(false);
    else setIsMobile(true);
  };
  const addToHistory = () => {
    if (moviesVisited?.map((i) => i.movieId).includes(details.movieId)) return;
    var data = {
      uid: userId,
      movieId: details.movieId,
      title: details.title,
      genres: details.genre,
    };
    dispatch(updateUserHistory({ data }));
  };
  useEffect(() => {
    if (userId && historyStatus === "loaded") addToHistory();
  }, [userId, historyStatus]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => {
      window.removeEventListener("resize", checkWidth);
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {!isMobile ? (
        <MovieDesktop details={details} setOpenTrailer={setOpenTrailer} />
      ) : (
        <MovieMobile details={details} setOpenTrailer={setOpenTrailer} />
      )}
      {openTrailer ? (
        <TrailerModal link={details.trailer} setOpenTrailer={setOpenTrailer} />
      ) : (
        ""
      )}
    </>
  );
}
export const MovieMobile = ({ details, setOpenTrailer }) => {
  const [indicate, setIndicate] = useState(false);
  const checkScroll = () => {
    const imgcon = document.getElementById("imgcont");
    // console.log(imgcon);
    if (!imgcon) return;
    if (imgcon?.offsetHeight * 0.3 < window.scrollY) setIndicate(true);
    else setIndicate(false);
  };
  function GetPoster(details) {
    if (details.largeImage !== "") return details.largeImage;
    else if (details.poster1 !== "") return details.poster1;
    else return details.poster2;
  }
  useEffect(() => {
    checkScroll();
    window.addEventListener("scroll", checkScroll);
    return () => window.addEventListener("scroll", checkScroll);
  }, []);
  return (
    <div className={styles2.movie_page}>
      <div className={`${styles2.movie_nav} ${indicate ? styles2.active : ""}`}>
        <span>
          <h4>{details.title}</h4>
          <small>{details.year}</small>
        </span>
        <div className={styles2.imdb}>
          {parseFloat(details.imdbRating).toFixed(1)}
        </div>
      </div>
      <div className={styles2.imgbg}>
        <img
          src={
            GetPoster(details) !== ""
              ? GetPoster(details)
              : "/assets/no-image.png"
          }
          alt="no-image"
        />
      </div>
      <div className={styles2.img_content} id="imgcont">
        <div className={`${styles.genre} ${styles2.top}`}>
          <h6 className={styles.sec_header}>GENRE</h6>
          <div className={styles.genre_values}>
            {details.genre?.map((name, index) => {
              if (!index)
                return (
                  <h5 className={styles.sec_value} key={Math.random() * 1000}>
                    {name}
                  </h5>
                );
              else
                return (
                  <h5 className={styles.sec_value} key={Math.random() * 1000}>
                    , {name}
                  </h5>
                );
            })}
          </div>
        </div>

        <div className={styles2.bottom}>
          <h3 className={styles.title}>{details?.title}</h3>
          <ul className={styles.more_details}>
            <li>
              <i className="fa fa-star-o" aria-hidden="true"></i>
              <small>IMBD :</small>
              <strong>{parseFloat(details.imdbRating).toFixed(1)}</strong>
            </li>
            <li>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <small>Duration :</small> <strong>{details?.runtime}</strong>
            </li>
            <li>
              <i className="fa fa-calendar-o" aria-hidden="true"></i>
              <small>Year :</small> <strong>{details?.year}</strong>
            </li>
          </ul>
        </div>
      </div>
      <div className={styles2.moreinfo}>
        {details.trailer.length > 0 ? (
          <div
            className={styles2.trailer}
            href={`https://www.youtube.com/watch?v=${details?.trailer}`}
            target="_blank"
            onClick={() => setOpenTrailer(true)}
          >
            <i className="fa-solid fa-play"></i>
          </div>
        ) : (
          ""
        )}
        <div className={styles2.block2}>
          <div>
            <h4 className={styles.sec_header}>description</h4>
            <div className={styles.description}>
              <p>{details?.description}</p>
            </div>
          </div>
          <ActionIcons details={details} />
          <CastANDcrew directors={details.directors} actors={details.actors} />
          <SimilarMovies details={details} />
        </div>
      </div>
    </div>
  );
};
export const MovieDesktop = ({ details, setOpenTrailer }) => {
  return (
    <div className={styles.movie_page}>
      <div className={styles.imgbg}>
        <img
          src={
            details?.largeImage ? details?.largeImage : "/assets/no-image.png"
          }
          alt="no-image"
        />
      </div>

      <div className={styles.content}>
        <div className={styles.left_content}>
          <div className={`${styles.genre}`}>
            <h6 className={styles.sec_header}>GENRE</h6>
            <div className={styles.genre_values}>
              {details.genre?.map((name, index) => {
                if (!index)
                  return (
                    <h5 className={styles.sec_value} key={Math.random() * 1000}>
                      {name}
                    </h5>
                  );
                else
                  return (
                    <h5 className={styles.sec_value} key={Math.random() * 1000}>
                      , {name}
                    </h5>
                  );
              })}
            </div>
          </div>
          <h3 className={styles.title}>{details?.title}</h3>
          <div className={styles.description}>
            <p>{details?.description}</p>
          </div>
          {/* <div className={styles.main_details}></div> */}
          <ul className={styles.more_details}>
            <li>
              <i className="fa fa-star-o" aria-hidden="true"></i>
              <small>IMBD :</small>{" "}
              <strong>{parseFloat(details.imdbRating).toFixed(1)}</strong>
            </li>
            <li>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <small>Duration :</small> <strong>{details?.runtime}</strong>
            </li>
            <li>
              <i className="fa fa-calendar-o" aria-hidden="true"></i>
              <small>Year :</small> <strong>{details?.year}</strong>
            </li>
          </ul>
          <ul className={styles.action_icons}>
            {details.trailer.length > 0 ? (
              <li>
                <div
                  className={styles.trailer}
                  // href={`https://www.youtube.com/watch?v=${details?.trailer}`}
                  // target="_blank"
                  style={{
                    opacity: details.trailer.length > 0 ? "1" : ".4",
                  }}
                  onClick={() => setOpenTrailer(true)}
                >
                  <i className="fa-solid fa-play"></i>
                  watch Trailer
                </div>
              </li>
            ) : (
              ""
            )}

            <li>
              <ActionIcons details={details} />
            </li>
          </ul>
        </div>
        <div className={styles.right_content}>
          <CastANDcrew directors={details.directors} actors={details.actors} />
          <SimilarMovies details={details} />
        </div>
      </div>
    </div>
  );
};
export function ActionIcons({ details }) {
  // const [isPending, startTransition] = useTransition();
  // const movies_status = useSelector((state) => state.userRatings.status);
  const movies = useSelector((state) => state.userRatings.movies);
  const userId = useSelector((state) => state.userAuth.user.uid);
  //const details = useSelector((state) => state.movie.details);
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  const [load, setLoad] = useState({
    l1: false,
    l2: false,
    l3: false,
    l4: false,
  });
  const dispatch = useDispatch();
  const [userData, setUserData] = useState({});

  const toggleLike = () => {
    let a;
    if (userData.liked === 1) a = 0;
    else a = 1;
    setUserData({ ...userData, liked: a });
  };

  const toggleDislike = () => {
    let a;
    if (userData.liked === -1) a = 0;
    else a = -1;
    setUserData({ ...userData, liked: a });
  };

  const toggleWatched = () => {
    setUserData((prev) => ({ ...prev, watched: !prev.watched }));
  };
  const toggleMyList = () => {
    setUserData((prev) => ({ ...prev, myList: !prev.myList }));
  };

  const saveToDatabase = () => {
    const mIfo = movies.find((i) => i.movieId === details.movieId);

    if (mIfo && _.isEqual(mIfo, userData)) {
      // console.log("no need of update");
      return;
    }

    // console.log(newObj);
    var { liked, movieId, watched, title, uid, myList } = userData;
    var newObj = {
      liked,
      movieId,
      watched,
      myList,
      title,
      uid,
    };
    var initial = {
      uid: userId,
      movieId: details.movieId,
      title: details.title,
      liked: 0,
      watched: false,
      myList: false,
    };
    const isInitialObj = _.isEqual(initial, newObj);
    if (newObj && isInitialObj && mIfo) {
      // console.log("delete the document");
      dispatch(deleteMovieData({ uid: userId, mid: details.movieId }));
    } else if (mIfo && !isInitialObj) {
      // console.log("upd");
      dispatch(
        updateMovieData({
          uid: userId,
          mid: details.movieId,
          data: newObj,
        })
      );
    } else if (!mIfo && !isInitialObj) {
      // console.log("add");
      dispatch(addMovieData({ ...newObj }));
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => saveToDatabase(), 450);
    return () => clearTimeout(timer);
  }, [userData]);

  const addToRecentlyViewed = () => {
    let recent = {};
    window
      ? (recent = JSON.parse(localStorage.getItem(`recent_${userId}`)) || {})
      : true;
    recent["uid"] = userId;
    recent["movies"] = recent["movies"] || [];
    if (recent["movies"].includes(details.movieId)) {
      recent["movies"] = recent["movies"].filter((i) => i != details.movieId);
    }
    recent["movies"].unshift(details.movieId);
    recent["movies"] = recent["movies"].slice(0, 5);
    if (window) {
      localStorage.setItem(`recent_${userId}`, JSON.stringify(recent));
    } else {
      return true;
    }
  };
  const initialize = () => {
    const movie = movies.find((i) => i.movieId === details.movieId);
    if (movie) {
      setUserData(movie);
    } else {
      const obj = {
        uid: userId,
        movieId: details.movieId,
        title: details.title,
        liked: 0,
        watched: false,
        myList: false,
      };
      setUserData(obj);
    }
  };

  useEffect(() => {
    addToRecentlyViewed();
    // dispatch(fetchMovies(userId));
    initialize();
  }, [movies]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {userData && (
        <div className={styles.icons}>
          <div className={styles.action_group} style={{ opacity: ".3" }}>
            <button className={styles.icon}>
              {/* <i className="fa-solid fa-share-nodes"></i> */}
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
            <small>suggest</small>
          </div>

          <div
            className={styles.action_group}
            onClick={() => authorized && toggleLike()}
          >
            <button
              title="liked"
              data-src="liked"
              className={styles.icon}
              id="like"
              style={{
                background: userData.liked === 1 ? "var(--secondary)" : "",
                color: userData.liked === 1 ? "var(--font-primary)" : "",
                opacity: userData.liked === 1 ? "1" : ".55",
              }}
            >
              <i className="far fa-thumbs-up"></i>
            </button>
            <small>like</small>
          </div>

          <div
            className={styles.action_group}
            onClick={() => authorized && toggleDislike()}
          >
            <button
              title="disliked"
              data-src="disliked"
              className={styles.icon}
              id="dislike"
              style={{
                background: userData.liked === -1 ? "var(--secondary)" : "",
                color: userData.liked === -1 ? "var(--font-primary)" : "",
                opacity: userData.liked === -1 ? "1" : ".55",
              }}
            >
              <i className="far fa-thumbs-down"></i>
            </button>
            <small>dislike</small>
          </div>

          <div
            className={styles.action_group}
            onClick={() => authorized && toggleWatched()}
          >
            <button
              title="watched ?"
              data-src="watched ?"
              className={styles.icon}
              id="unwatched"
              style={{
                background: userData.watched ? "var(--secondary)" : "",
                color: userData.watched ? "var(--font-primary)" : "",
                opacity: userData.watched ? "1" : ".55",
              }}
            >
              <i className="fas fa-check"></i>
            </button>
            <small>seen ?</small>
          </div>

          <div
            className={styles.action_group}
            onClick={() => authorized && toggleMyList()}
          >
            <button
              title="add to list"
              data-src="add to list"
              className={styles.icon}
              id="myList"
              style={{
                background: userData.myList ? "var(--secondary)" : "",
                color: userData.myList ? "var(--font-primary)" : "",
                opacity: userData.myList ? "1" : ".55",
              }}
            >
              {/* <i className="fas fa-plus"></i> */}
              <i className="fa fa-bookmark-o" aria-hidden="true"></i>
              {/* <i className="fa fa-bookmark-o" aria-hidden="true"></i> */}
            </button>
            <small>my list</small>
          </div>
        </div>
      )}
    </>
  );
}
