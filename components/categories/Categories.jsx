import React, { useEffect, useState } from "react";
import Carousel from "../carousel/Carousel";
import axios from "axios";
import styles from "./sections.module.css";
import { Loader1 } from "../../utils/loaders/Loading";
import MyList from "./MyList";
import { useSelector } from "react-redux";
import LazyLoad from "../../utils/lazyLoad/LazyLoad";

export default function Categories() {
  const categories = [
    { name: "top rated" },
    { name: "action & Thriller", genres: ["Action", "Thriller"] },
    { name: "oscar winner", genres: ["Winner"] },
    { name: "romance & drama", genres: ["Romance", "Drama"] },
    { name: "oscar Nominee", genres: ["Nominee"] },
    { name: "animation", genres: ["Animation"] },
    { name: "watched" },
    { name: "horror", genres: ["Horror", "Thriller"] },
    { name: "based on true story", genres: ["Biography"] },
    { name: "rated movies" },
  ];
  return (
    <div className={styles.two}>
      <Recommend name="collaborative" />
      <MyList />
      <Recommend name="watched" />

      {categories.map((catg) => (
        <LazyLoad key={Math.random() * 3.1423423}>
          <Category name={catg.name} query={{ genres: catg?.genres }} />
        </LazyLoad>
      ))}
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
  const status = useSelector((state) => state.userData.status);
  const movies = useSelector((state) => state.userData.movies);
  const getRecommendations = async () => {
    await axios
      .post(`${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/collab/`, {
        movies: queryList,
      })
      .then((res) => {
        setResult(res.data.result);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const getSimilar = async () => {
    setTitle(`beacause you watched, ${queryList[0]}`);
    var id = queryList[0];
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
    if (queryList) {
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
    recommendMovies();
  }, [queryList]); //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (status !== "loading") {
      if (name === "collaborative") {
        var mlist = movies.filter((i) => i.liked != 0);
        mlist = mlist.map((i) => [i.movieId, i.liked]);
        // console.log(mlist);
      }
      if (name === "watched") {
        var mlist = movies.filter((i) => i.watched);
        mlist = mlist.map((i) => i.movieId).reverse();
        // console.log(mlist);
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

      {!result?.length && name === "collaborative" ? (
        <h2
          style={{
            color: "var(--font-primary)",
            textAlign: "center",
            margin: "5%",
          }}
        >
          &quot; rate movies to get Recommendations &quot;
        </h2>
      ) : (
        ""
      )}
    </>
  );
}

export const Category = ({ name, query }) => {
  const status = useSelector((state) => state.userData.status);
  const movies = useSelector((state) => state.userData.movies);

  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState();

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [result]);

  const getUserMovies = () => {
    var mlist = [];
    if (name === "rated movies") mlist = movies?.filter((i) => i.liked != 0);
    else if (name === "watched") mlist = movies?.filter((i) => i.watched);
    mlist = mlist.map((i) => [i.movieId]).reverse();
    if (JSON.stringify(mlist) !== JSON.stringify(result)) setResult(mlist);
    // setLoading(false);
  };

  const fetchGenre = async (signal) => {
    const domain = process.env.NEXT_PUBLIC_MOVIE_SERVER;
    if (name === "top rated") {
      const url = `${domain}/movies/toprated/`;
      await axios
        .get(url, { signal: signal })
        .then((res) => {
          setResult(res.data.result);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
    //  else if (name === "rated movies") {
    //   getUserMovies();
    // }
    else if (query.genres) {
      const url = `${domain}/movies/genres/`;
      await axios
        .post(url, { genre: query.genres }, { signal: signal })
        .then((res) => {
          setResult(res.data[0].result);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true);
    fetchGenre(signal);
    return () => controller.abort();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  // list={result?.sort(() => .5 - Math.random())}
  useEffect(() => {
    if (status === "loaded" && !query?.genres && name !== "top rated") {
      getUserMovies();
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {result?.length ? (
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
