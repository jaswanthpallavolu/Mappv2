import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOpen, getRecomendations } from "../../redux/features/movieSlice";
import {
  updateMovieData,
  deleteMovieData,
  addMovieData,
  fetchMovies,
} from "../../redux/features/userRatingSlice";
import styles from "./movie.module.css";
import Carousel from "../carousel/Carousel";
import { Loader1 } from "../../utils/loaders/Loading";
import CastAndCrew from "./CastAndCrew";

export default function Movie() {
  const status = useSelector((state) => state.movie.status);
  const details = useSelector((state) => state.movie.details);

  const recommends = useSelector((state) => state.movie.recommends);
  const dispatch = useDispatch();
  const [menuToggle, setMenuToggle] = useState(false);
  const [posterLoad, setPosterLoad] = useState(false);
  useEffect(() => {
    dispatch(getRecomendations({ id: details.movieId }));
  }, [details]); //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setPosterLoad(true);
    setTimeout(() => {
      setPosterLoad(false);
    }, 200);
  }, [details?.poster]);

  return (
    <div className={styles.movie} style={{ color: "var(--font-primary)" }}>
      <>
        {details ? (
          <>
            <div className={styles.mov_details}>
              {!posterLoad ? (
                <img
                  className={styles.main_img}
                  src={details?.poster}
                  alt="error"
                />
              ) : (
                <img
                  className={styles.main_img}
                  src="https://c.tenor.com/kjTEaH2h3e8AAAAC/loading-waiting.gif"
                  alt="loading.."
                />
              )}
              <div className={styles.movie_info}>
                <div className={styles.genres}>
                  {details.genre?.map((name) => (
                    <div key={Math.random() * 1000} className={styles.genre}>
                      {name}
                    </div>
                  ))}
                </div>
                <h1>{details.title}</h1>
                <div className={styles.yr}>
                  <h3>{details.year}</h3>
                  <h4>IMDb</h4>
                  <p>{parseFloat(details.imdbRating).toFixed(1)}</p>
                </div>
                <p className={styles.desc}>{details.description}</p>
                {/* <div className={styles.actors}>Actors: {info.details.Actors}</div>
                            <div className={styles.actors}>Director(s): {info.details.Director}</div> */}
              </div>
              <Actions mid={details.movieId} />
            </div>

            <div className={styles.more_section}>
              <div className={styles.menus}>
                <div
                  onClick={() => setMenuToggle(!menuToggle)}
                  className={styles.menu}
                  style={{ opacity: menuToggle ? ".5" : "" }}
                >
                  you may like this
                </div>

                <div
                  onClick={() => setMenuToggle(!menuToggle)}
                  style={{ opacity: !menuToggle ? ".5" : "" }}
                  className={styles.menu}
                >
                  cast & crew
                </div>
              </div>
              <div className={styles.selected_content}>
                {!menuToggle ? (
                  <>
                    {status === "succeeded" ? (
                      <Carousel
                        className={styles.carousel1}
                        list={recommends}
                        size="small"
                      />
                    ) : (
                      <div
                        style={{
                          marginTop: "5%",
                          display: "grid",
                          placeItems: "center",
                        }}
                      >
                        <Loader1 />
                      </div>
                    )}
                  </>
                ) : (
                  <CastAndCrew
                    leads={details.actors}
                    directors={details.directors}
                  />
                )}
              </div>
            </div>

            <button
              className={styles.cbtn}
              style={{ background: "none", color: "var(--font-primary)" }}
              onClick={() => dispatch(setOpen(false))}
            >
              <i className="fas fa-times"></i>
            </button>
          </>
        ) : (
          <p> wait</p>
        )}
      </>
    </div>
  );
}

// so many conditional statements used on user rating actions
export function Actions({ mid }) {
  const movies_status = useSelector((state) => state.userRatings.status);
  const allmovies = useSelector((state) => state.userRatings.movies);
  const uid = useSelector((state) => state.userAuth.user.uid);
  const details = useSelector((state) => state.movie.details);
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  const [load, setLoad] = useState({
    l1: false,
    l2: false,
    l3: false,
    l4: false,
  });
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState();

  const handleLike = () => {
    setLoad({ ...load, l1: true });
    let a;
    if (toggle.liked === 1) {
      a = 0;
    } else {
      a = 1;
    }
    const mIfo = allmovies.find((i) => i.movieId === mid);
    if (!mIfo)
      dispatch(addMovieData({ ...toggle, movieId: mid, uid: uid, liked: a }));
    else if (mIfo.liked === 1 && !mIfo.watched && mIfo.myList === false)
      dispatch(deleteMovieData({ uid, mid }));
    else dispatch(updateMovieData({ uid, mid, data: { liked: a } }));
  };
  const handleDisLike = () => {
    setLoad({ ...load, l2: true });
    let a;
    if (toggle.liked === -1) {
      a = 0;
    } else {
      a = -1;
    }
    const mIfo = allmovies.find((i) => i.movieId === mid);
    if (!mIfo)
      dispatch(addMovieData({ ...toggle, movieId: mid, uid: uid, liked: a }));
    else if (mIfo.liked === -1 && !mIfo.watched && mIfo.myList === false)
      dispatch(deleteMovieData({ uid, mid }));
    else dispatch(updateMovieData({ uid, mid, data: { liked: a } }));
  };
  const handleWatched = () => {
    setLoad({ ...load, l3: true });
    const mIfo = allmovies.find((i) => i.movieId === mid);
    if (!mIfo)
      dispatch(
        addMovieData({
          ...toggle,
          movieId: mid,
          uid: uid,
          watched: !toggle.watched,
        })
      );
    else if (mIfo.liked === 0 && mIfo.watched && mIfo.myList === false)
      dispatch(deleteMovieData({ uid, mid }));
    else
      dispatch(
        updateMovieData({ uid, mid, data: { watched: !toggle.watched } })
      );
  };
  const handleAddToList = () => {
    setLoad({ ...load, l4: true });
    const mIfo = allmovies.find((i) => i.movieId === mid);
    if (!mIfo)
      dispatch(
        addMovieData({ ...toggle, movieId: mid, uid: uid, myList: true })
      );
    else if (mIfo.myList === false)
      dispatch(
        updateMovieData({ uid, mid, data: { ...toggle, myList: true } })
      );
    else if (mIfo.liked === 0 && !mIfo.watched && mIfo.myList === true)
      dispatch(deleteMovieData({ uid, mid }));
    else
      dispatch(
        updateMovieData({ uid, mid, data: { ...toggle, myList: false } })
      );
  };
  useEffect(() => {
    dispatch(fetchMovies(uid));
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (movies_status === "loaded") {
      const movie = allmovies.find((i) => i.movieId === mid);
      if (movie) {
        setToggle(movie);
      } else {
        const obj = {
          title: details.title,
          liked: 0,
          watched: false,
          myList: false,
        };
        setToggle(obj);
      }
      setLoad({ l1: false, l2: false, l3: false, l4: false });
    }
  }, [movies_status]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.actions}>
      <div className={styles.icons}>
        {toggle ? (
          <>
            {!load.l1 ? (
              <div onClick={() => authorized && handleLike()}>
                {toggle.liked === 1 ? (
                  <button
                    data-src="liked"
                    className={styles.icon}
                    id="like"
                    style={{ opacity: toggle.liked === 1 ? "1" : "" }}
                  >
                    <i className="fas fa-thumbs-up"></i>
                  </button>
                ) : (
                  <button
                    data-src="like it"
                    className={styles.icon}
                    id="like"
                    style={{ opacity: toggle.liked === 1 ? "1" : "" }}
                  >
                    <i className="far fa-thumbs-up"></i>
                  </button>
                )}
              </div>
            ) : (
              <BtnLoad />
            )}

            {!load.l2 ? (
              <div onClick={() => authorized && handleDisLike()}>
                {toggle.liked === -1 ? (
                  <button
                    data-src="disliked"
                    className={styles.icon}
                    id="dislike"
                    style={{ opacity: toggle.liked === -1 ? "1" : "" }}
                  >
                    <i className="fas fa-thumbs-down"></i>
                  </button>
                ) : (
                  <button
                    data-src="dislike it"
                    className={styles.icon}
                    id="dislike"
                    style={{ opacity: toggle.liked === -1 ? "1" : "" }}
                  >
                    <i className="far fa-thumbs-down"></i>
                  </button>
                )}
              </div>
            ) : (
              <BtnLoad />
            )}

            {!load.l3 ? (
              <div onClick={() => authorized && handleWatched()}>
                {!toggle.watched ? (
                  <button
                    data-src="watched ?"
                    className={styles.icon}
                    id="unwatched"
                  >
                    <i className="fas fa-eye-slash"></i>
                  </button>
                ) : (
                  <button
                    data-src="watched"
                    className={styles.icon}
                    id="watched"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                )}
              </div>
            ) : (
              <BtnLoad />
            )}

            {!load.l4 ? (
              <div onClick={() => authorized && handleAddToList()}>
                {!toggle.myList ? (
                  <button
                    data-src="add to list"
                    className={styles.icon}
                    id="myList"
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                ) : (
                  <button
                    data-src="remove from list"
                    className={styles.icon}
                    id="myList"
                  >
                    <i className="far fa-times-circle"></i>
                  </button>
                )}
              </div>
            ) : (
              <BtnLoad />
            )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export function BtnLoad() {
  return (
    <div className={styles.btnloader}>
      <span></span>
    </div>
  );
}
