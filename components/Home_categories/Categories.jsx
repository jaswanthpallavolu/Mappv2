import React, { useEffect, useState, useRef } from "react";
import Carousel from "../carousel/Carousel";
import axios from "axios";
import styles from "./sections.module.css";
import { Loader1 } from "../../utils/loaders/Loading";
import { useSelector } from "react-redux";
import LazyLoad from "../../utils/lazyLoad/LazyLoad";
import MyList from "./MyList";

export default function Categories() {
  const [tags, setTags] = useState([]);
  const [mostLiked, setMostLiked] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.userAuth.user);

  const historyStatus = useSelector((state) => state.userHistory.status);
  const genresHistory = useSelector(
    (state) => state.userHistory?.history?.genres
  );
  const fetchTags = async (signal) => {
    const url = `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/tags/`;
    if (!genresHistory) {
      await axios
        .get(url, { signal })
        .then((res) => {
          setTags(res.data.tagNames);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else if (genresHistory) {
      await axios
        .post(url, { userHistory: genresHistory }, { signal })
        .then((res) => {
          setTags(res.data.tagNames);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };
  const fetchMostLiked = async (signal) => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/friends/likedByFriends/${user.uid}`,
        { signal }
      )
      .then((res) => {
        // console.log();
        setMostLiked(res.data.mostLiked);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true);
    if (historyStatus === "loaded" || !user.authorized) fetchTags(signal);
    if (user.authorized) fetchMostLiked(signal);
    return () => controller.abort();
  }, [historyStatus]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={styles.home_categories}>
      {user.authorized && <MyList />}

      {user.authorized ? (
        <>
          <Recommend name="collaborative" />
          {mostLiked?.length && (
            <CategoryTemplate name="most liked by friends" list={mostLiked} />
          )}
        </>
      ) : (
        <p className={styles.suggest_text}>
          &quot; Login and rate movies to get Recommendations &quot;
        </p>
      )}
      {user.authorized && <Recommend name="watched" />}
      <Category name="recently viewed" query={{ genres: undefined }} />
      {!loading &&
        tags.map((tag, index) => (
          <LazyLoad key={index}>
            <Tag tagname={tag} />
          </LazyLoad>
        ))}

      {/* NEED TO REMOVE This */}
      {user.authorized && (
        <LazyLoad>
          <Category name="watched" query={{ genres: undefined }} />
          <Category name="rated movies" query={{ genres: undefined }} />
        </LazyLoad>
      )}
    </div>
  );
}

export function Recommend({ name }) {
  const [loading, setLoading] = useState(false);
  const [queryList, setQueryList] = useState([]);
  const [title, setTitle] = useState("Recommended for you");
  // const [rated, setRated] = useState();
  // const [watched, setWatched] = useState();
  const [result, setResult] = useState();
  const status = useSelector((state) => state.userRatings.status);
  const movies = useSelector((state) => state.userRatings.movies);
  const getRecommendations = async (signal) => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/collaborative/`,
        {
          movies: queryList,
        },
        { signal }
      )
      .then((res) => {
        setResult(res.data.result);
        // setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const getSimilar = async (signal) => {
    // console.log("collab");
    if (window.innerWidth > 600)
      setTitle(`because you watched, ${queryList[0][1]}`);
    else setTitle(`you watched, ${queryList[0][1]}`);
    var id = queryList[0][0];
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/contentbased/${id}`,
        { signal }
      )
      .then((res) => {
        setResult(res.data.result);
        // setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const recommendMovies = (signal) => {
    if (queryList.length) {
      // setLoading(true);
      if (name === "collaborative") getRecommendations(signal);
      else if (name === "watched") getSimilar(signal);
      // }
    } else {
      setResult([]);
      // setLoading(false);
    }
  };
  useEffect(() => {
    const controller = new AbortController();
    if (queryList) recommendMovies(controller.signal);
    return () => controller.abort();
  }, [queryList]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // if (status !== "loading" && status) {
    if (name === "collaborative") {
      var mlist = movies.filter((i) => i.liked != 0);
      mlist = mlist.map((i) => [i.movieId, i.liked]);
      // console.log(mlist);
    }
    if (name === "watched") {
      var mlist = movies.filter((i) => i.watched);
      mlist = mlist.map((i) => [i.movieId, i.title]).reverse();
    }

    if (JSON.stringify(queryList) !== JSON.stringify(mlist))
      setQueryList(mlist);
    // }
  }, [movies]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {result?.length ? (
        <div className={styles.c_section}>
          <div className={styles.head}>
            <div className={styles.name}>{title}</div>
          </div>
          <Carousel list={result} key={result?.length} />
          {/* {!loading ? (
            <Carousel list={result} />
          ) : (
            <div
              style={{
                height: "20vh",
                display: "grid",
                placeItems: "center",
                alignItems: "center",
              }}
            >
              <Loader1 />
            </div>
          )} */}
        </div>
      ) : (
        ""
      )}

      {!result?.length && name === "collaborative" ? (
        <p className={styles.suggest_text}>
          &quot; rate movies to get Recommendations &quot;
        </p>
      ) : (
        ""
      )}
    </>
  );
}

export function CategoryTemplate({ name, list }) {
  return (
    <div className={styles.c_section}>
      <div className={styles.head}>
        <div className={styles.name}>{name}</div>
      </div>
      <Carousel list={list} />
    </div>
  );
}

export const Tag = ({ tagname }) => {
  // const status = useSelector((state) => state.userRatings.status);
  // const movies = useSelector((state) => state.userRatings.movies);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);

  const fetchMoviesByTag = async (signal) => {
    setLoading(true);
    const url = `${
      process.env.NEXT_PUBLIC_MOVIE_SERVER
    }/movies/tags/${tagname.replace(" ", "+")}`;
    if (url) {
      await axios
        .get(url, { signal })
        .then((res) => {
          setResult(res.data.movies);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    fetchMoviesByTag(signal);

    return () => controller.abort();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  // list={result?.sort(() => .5 - Math.random())}

  return (
    <>
      {result?.length ? (
        <div className={styles.c_section}>
          <div className={styles.head}>
            <div className={styles.name}>{tagname}</div>
          </div>
          {!loading ? (
            <Carousel list={result} />
          ) : (
            <div
              style={{
                height: "20vh",
                display: "grid",
                placeItems: "center",
                alignItems: "center",
              }}
            >
              <Loader1 />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export const Category = ({ name }) => {
  const status = useSelector((state) => state.userRatings.status);
  const movies = useSelector((state) => state.userRatings.movies);
  const uid = useSelector((state) => state.userAuth.user.uid);
  // const user.authorized = useSelector((state) => state.userAuth.user.user.authorized);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();
  const mountedRef = useRef(true);

  const getLocalStorageMovies = () => {
    var mlist = [];
    if (name === "recently viewed") {
      window
        ? (mlist = JSON.parse(localStorage.getItem(`recent_${uid}`)))
        : true;

      mlist = mlist ? mlist["movies"] : [];
      // console.log("rv2", mlist);
    }

    if (JSON.stringify(mlist) !== JSON.stringify(result)) {
      setResult(mlist);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  };
  const getUserMovies = () => {
    var mlist = [];
    if (name === "rated movies") mlist = movies?.filter((i) => i.liked != 0);
    else if (name === "watched") mlist = movies?.filter((i) => i.watched);
    mlist = mlist?.map((i) => [i.movieId]).reverse();
    if (JSON.stringify(mlist) !== JSON.stringify(result)) {
      setResult(mlist);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
    // setLoading(false);
  };

  useEffect(() => {
    if (
      status === "loaded" &&
      mountedRef.current &&
      name &&
      name !== "recently viewed"
    ) {
      getUserMovies();
    }
  }, [status, uid]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (name === "recently viewed") getLocalStorageMovies();
  }, [uid]);
  //clean up function
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return (
    <>
      {result?.length && !loading ? (
        <div className={styles.c_section}>
          <div className={styles.head}>
            {name === "recently viewed" ? (
              <div className={styles.name}>
                {name}
                <p
                  onClick={() => {
                    window?.localStorage.removeItem(`recent_${uid}`);
                    getLocalStorageMovies();
                  }}
                >
                  clear
                </p>
              </div>
            ) : (
              <p className={styles.name}>{name}</p>
            )}
          </div>
          {!loading ? (
            <Carousel list={result} />
          ) : (
            <div
              style={{
                height: "20vh",
                display: "grid",
                placeItems: "center",
                alignItems: "center",
              }}
            >
              <Loader1 />
            </div>
          )}
        </div>
      ) : (
        ""
      )}
    </>
  );
};
