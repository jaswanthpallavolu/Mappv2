import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateMovieData,
  deleteMovieData,
  addMovieData,
  fetchMovies,
} from "../../redux/features/userRatingSlice";

import styles from "./MovieDetails.module.css";
import styles2 from "./moviemobile.module.css";
import CastANDcrew from "./CastANDcrew";
import Recommends from "./Recommends";
import TrailerModal from "./TrailerModal";

export default function MovieDetails({ details }) {
  const [openTrailer, setOpenTrailer] = useState(false);
  const [isMobile, setIsMobile] = useState();
  const checkWidth = () => {
    if (window.innerWidth > 600) setIsMobile(false);
    else setIsMobile(true);
  };
  useEffect(() => {
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => {
      window.removeEventListener("resize", checkWidth);
    };
  }, []);
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
  return (
    <div className={styles2.movie_page}>
      <div className={styles2.imgbg}>
        {details?.largeImage ? <img src={details?.largeImage} /> : ""}
      </div>
      <div className={styles2.img_content}>
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
              <small>IMBD :</small> <strong>{details?.imdbRating}</strong>
            </li>
            <li>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <small>Duration :</small> <strong>2hr 30min</strong>
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
          <Actions details={details} />
          <CastANDcrew directors={details.directors} actors={details.actors} />
          <Recommends details={details} />
        </div>
      </div>
    </div>
  );
};
export const MovieDesktop = ({ details, setOpenTrailer }) => {
  return (
    <div className={styles.movie_page}>
      {details?.largeImage ? (
        <div className={styles.imgbg}>
          <img src={details?.largeImage} />
        </div>
      ) : (
        ""
      )}
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
              <small>IMBD :</small> <strong>{details?.imdbRating}</strong>
            </li>
            <li>
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <small>Duration :</small> <strong>2hr 30min</strong>
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
              <Actions details={details} />
            </li>
          </ul>
        </div>
        <div className={styles.right_content}>
          <CastANDcrew directors={details.directors} actors={details.actors} />
          <Recommends details={details} />
        </div>
      </div>
    </div>
  );
};
export function Actions({ details }) {
  const movies_status = useSelector((state) => state.userRatings.status);
  const allmovies = useSelector((state) => state.userRatings.movies);
  const uid = useSelector((state) => state.userAuth.user.uid);
  //const details = useSelector((state) => state.movie.details);
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  const [load, setLoad] = useState({
    l1: false,
    l2: false,
    l3: false,
    l4: false,
  });
  const dispatch = useDispatch();
  const [userData, setUserData] = useState();

  const handleLike = () => {
    // setLoad({ ...load, l1: true });
    let a;
    if (userData.liked === 1) a = 0;
    else a = 1;
    setUserData({ ...userData, liked: a });

    const mIfo = allmovies.find((i) => i.movieId === details.movieId);
    if (!mIfo)
      dispatch(
        addMovieData({
          ...userData,
          movieId: details.movieId,
          uid: uid,
          liked: a,
        })
      );
    else if (mIfo.liked === 1 && !mIfo.watched && mIfo.myList === false)
      dispatch(deleteMovieData({ uid, mid: details.movieId }));
    else
      dispatch(
        updateMovieData({ uid, mid: details.movieId, data: { liked: a } })
      );
  };
  const handleDisLike = () => {
    // setLoad({ ...load, l2: true });
    let a;
    if (userData.liked === -1) a = 0;
    else a = -1;
    setUserData({ ...userData, liked: a });

    const mIfo = allmovies.find((i) => i.movieId === details.movieId);
    if (!mIfo)
      dispatch(
        addMovieData({
          ...userData,
          movieId: details.movieId,
          uid: uid,
          liked: a,
        })
      );
    else if (mIfo.liked === -1 && !mIfo.watched && mIfo.myList === false)
      dispatch(deleteMovieData({ uid, mid: details.movieId }));
    else
      dispatch(
        updateMovieData({ uid, mid: details.movieId, data: { liked: a } })
      );
  };
  const handleWatched = () => {
    const curr_status = userData.watched;
    setUserData({
      ...userData,
      watched: !userData.watched,
    });

    setLoad({ ...load, l3: true });
    const mIfo = allmovies.find((i) => i.movieId === details.movieId);
    if (!mIfo)
      dispatch(
        addMovieData({
          ...userData,
          movieId: details.movieId,
          uid: uid,
          watched: !curr_status,
        })
      );
    else if (mIfo.liked === 0 && mIfo.watched && mIfo.myList === false)
      dispatch(deleteMovieData({ uid, mid: details.movieId }));
    else
      dispatch(
        updateMovieData({
          uid,
          mid: details.movieId,
          data: { watched: !curr_status },
        })
      );
  };
  const handleAddToList = () => {
    const curr_status = userData.myList;
    setUserData({
      ...userData,
      myList: !curr_status,
    });
    // setLoad({ ...load, l4: true });
    const mIfo = allmovies.find((i) => i.movieId === details.movieId);
    if (!mIfo)
      dispatch(
        addMovieData({
          ...userData,
          movieId: details.movieId,
          uid: uid,
          myList: true,
        })
      );
    else if (mIfo.myList === false)
      dispatch(
        updateMovieData({
          uid,
          mid: details.movieId,
          data: { ...userData, myList: true },
        })
      );
    else if (mIfo.liked === 0 && !mIfo.watched && mIfo.myList === true)
      dispatch(deleteMovieData({ uid, mid: details.movieId }));
    else
      dispatch(
        updateMovieData({
          uid,
          mid: details.movieId,
          data: { ...userData, myList: false },
        })
      );
  };
  const addRecent = ()=>{
    let recent = JSON.parse(window.localStorage.getItem("recent")) || []
    if (recent.includes(details.movieId)){
      recent = recent.filter(i=>i!=details.movieId)
    }
    recent.unshift(details.movieId)
    window.localStorage.setItem("recent",JSON.stringify(recent))
  }
  useEffect(() => {
    dispatch(fetchMovies(uid));
    addRecent()
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (movies_status === "loaded") {
      const movie = allmovies.find((i) => i.movieId === details.movieId);
      if (movie) {
        setUserData(movie);
      } else {
        const obj = {
          title: details.title,
          liked: 0,
          watched: false,
          myList: false,
        };
        setUserData(obj);
      }
      setLoad({ l1: false, l2: false, l3: false, l4: false });
    }
  }, [movies_status, details.movieId]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {userData ? (
        <div className={styles.icons}>
          <div className={styles.action_group} style={{ opacity: ".3" }}>
            <button className={styles.icon}>
              <i className="fa-solid fa-share-nodes"></i>
            </button>
            <small>share</small>
          </div>

          <div
            className={styles.action_group}
            onClick={() => authorized && handleLike()}
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
            onClick={() => authorized && handleDisLike()}
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
            onClick={() => authorized && handleWatched()}
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
            onClick={() => authorized && handleAddToList()}
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
      ) : (
        ""
      )}
    </>
  );
}

export function BtnLoad() {
  return (
    <div className={styles.btnloader}>
      <span></span>
    </div>
  );
}
