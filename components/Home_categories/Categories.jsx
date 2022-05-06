import React, { useEffect, useState, useRef } from "react";
import Carousel from "../carousel/Carousel";
import axios from "axios";
import styles from "./sections.module.css";
import { Loader1 } from "../../utils/loaders/Loading";
import MyList from "./MyList";
import { useSelector } from "react-redux";
import LazyLoad from "../../utils/lazyLoad/LazyLoad";

export default function Categories() {
  // const categories = [
  //   { name: "top rated" },
  //   { name: "action & Thriller", genres: ["Action", "Thriller"] },
  //   { name: "oscar winner", genres: ["Winner"] },
  //   { name: "romance & drama", genres: ["Romance", "Drama"] },
  //   { name: "oscar Nominee", genres: ["Nominee"] },
  //   { name: "animation", genres: ["Animation"] },
  //   { name: "horror", genres: ["Horror", "Thriller"] },
  //   { name: "based on true story", genres: ["Biography"] },
  // ];
  // { name: "rated movies" },
  // { name: "watched" },
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  const fetchTags = async (signal) => {
    const url = `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/tags/`;
    if (url) {
      await axios
        .get(url, { signal: signal })
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
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true);
    fetchTags(signal);
    return () => controller.abort();
  }, []);
  return (
    <div className={styles.home_categories}>
      {JSON.parse(localStorage.getItem("recent")) ?
        <Category
          key={Math.random() * 3.1423423}
          name="recently viewed"
          query={{ genres: undefined }}
        />
      : ""}
      {authorized ? (
        <>
          <Recommend key={Math.random() * 3.1423423} name="collaborative" />
          {/* <MyList /> */}
          <Recommend key={Math.random() * 3.1423423} name="watched" />
        </>
      ) : (
        <p className={styles.suggest_text}>
          &quot; Login and rate movies to get Recommendations &quot;
        </p>
      )}
      {!loading &&
        tags.map((tag, index) => (
          <LazyLoad key={index}>
            <Tag tagname={tag} />
          </LazyLoad>
        ))}
      {/* {categories.map((catg, index) => (
        <LazyLoad key={index}>
          <Category name={catg.name} query={{ genres: catg?.genres }} />
        </LazyLoad>
      ))} */}

      {/* NEED TO REMOVE This */}
      {authorized ? (
        <LazyLoad>
          <>
            <Category
              key={Math.random() * 3.1423423}
              name="watched"
              query={{ genres: undefined }}
            />

            <Category
              key={Math.random() * 3.1423423}
              name="rated movies"
              query={{ genres: undefined }}
            />
          </>
        </LazyLoad>
      ) : (
        ""
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
  const getRecommendations = async () => {
    await axios
      .post(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/collaborative/`,
        {
          movies: queryList,
        }
      )
      .then((res) => {
        setResult(res.data.result);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const getSimilar = async () => {
    if (window.innerWidth > 600)
      setTitle(`beacause you watched, ${queryList[0][1]}`);
    else setTitle(`you watched, ${queryList[0][1]}`);
    var id = queryList[0][0];
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/contentbased/${id}`
      )
      .then((res) => {
        setResult(res.data.result);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const recommendMovies = () => {
    if (queryList.length) {
      setLoading(true);
      if (name === "collaborative") getRecommendations();
      else if (name === "watched") getSimilar();
      // }
    } else {
      setResult([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    if (queryList) recommendMovies();
  }, [queryList]); //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (status !== "loading" && status) {
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
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      {result?.length ? (
        <div className={styles.c_section}>
          <div className={styles.head}>
            <div className={styles.name}>{title}</div>
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

      {!result?.length && name === "collaborative" && status !== "loading" ? (
        <p className={styles.suggest_text}>
          &quot; rate movies to get Recommendations &quot;
        </p>
      ) : (
        ""
      )}
    </>
  );
}

export const Tag = ({ tagname }) => {
  // const status = useSelector((state) => state.userRatings.status);
  // const movies = useSelector((state) => state.userRatings.movies);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState([]);

  useEffect(() => {
    if (!result) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
  }, [result]);

  const fetchMoviesByTag = async (signal) => {
    const url = `${
      process.env.NEXT_PUBLIC_MOVIE_SERVER
    }/movies/tags/${tagname.replace(" ", "+")}`;
    if (url) {
      await axios
        .get(url, { signal: signal })
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
    setLoading(true);
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

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();
  const mountedRef = useRef(true);

  // useEffect(() => {
  //   if (mountedRef.current) {
  //   }
  // }, [result]);

  const getUserMovies = () => {
    var mlist = [];
    if (name === "rated movies") mlist = movies?.filter((i) => i.liked != 0);
    else if (name === "watched") mlist = movies?.filter((i) => i.watched);
    mlist = mlist.map((i) => [i.movieId]).reverse();
    if (name=="recently viewed") mlist = JSON.parse(localStorage.getItem("recent"));
    if (JSON.stringify(mlist) !== JSON.stringify(result)) {
      setResult(mlist);
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 100);
    }
    // setLoading(false);
  };

  // const fetchGenre = async (signal) => {
  //   const domain = process.env.NEXT_PUBLIC_MOVIE_SERVER;
  //   if (name === "top rated") {
  //     const url = `${domain}/movies/toprated/`;
  //     await axios
  //       .get(url, { signal: signal })
  //       .then((res) => {
  //         setResult(res.data.result);
  //         setLoading(false);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  //   //  else if (name === "rated movies") {
  //   //   getUserMovies();
  //   // }
  //   else if (query.genres) {
  //     const url = `${domain}/movies/genres/`;
  //     await axios
  //       .post(url, { genre: query.genres }, { signal: signal })
  //       .then((res) => {
  //         setResult(res.data[0].result);
  //         setLoading(false);
  //       })
  //       .catch((err) => console.log(err));
  //   }
  // };

  // useEffect(() => {
  //   const controller = new AbortController();
  //   const signal = controller.signal;
  //   setLoading(true);
  //   fetchGenre(signal);
  //   return () => controller.abort();
  // }, []); //eslint-disable-line react-hooks/exhaustive-deps
  // list={result?.sort(() => .5 - Math.random())}
  useEffect(() => {
    if (status === "loaded" && mountedRef.current && name) {
      getUserMovies();
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

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
            <div className={styles.name}>{name}</div>
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
