import React from "react";
import { useEffect, useState } from "react";
import styles from "./Recommends.module.css";
import styles2 from "./MovieDetails.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import Skeleton from "../../utils/skeleton/Skeleton";

export default function Recommends({ details }) {
  const [recommended_movies, setRecommended_movies] = useState();
  const [loading, setLoading] = useState(true);

  async function fetchMovies(signal) {
    setLoading(true);
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/contentbased/${details.movieId}`,
        { signal: signal }
      )
      .then((data) => {
        const res = data.data;
        setRecommended_movies(res.result.slice(0, 6));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    if (details.movieId) fetchMovies(signal);
    return () => {
      controller.abort();
    };
  }, [details.movieId]);

  return (
    <>
      {!loading ? (
        <ul className={styles.rec_container}>
          <li>
            <h6 className={styles2.sec_header}>Similar Movies</h6>
          </li>

          <ul className={styles.cards}>
            {recommended_movies?.map((id, index) => (
              <li key={index}>
                <PosterCard id={id} />
              </li>
            ))}
          </ul>
        </ul>
      ) : (
        ""
      )}
    </>
  );
}

export const PosterCard = ({ id }) => {
  const router = useRouter();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState(true);

  function GetPoster(details) {
    if (details.poster1 !== "") return details.poster1;
    else if (details.poster2 !== "") return details.poster2;
    else if (details?.small_Image !== "") return details?.small_Image;
    else return details.largeImage;
  }
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
    fetchMovie(signal);
    return () => {
      controller.abort();
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={styles.card_container}>
      {!loading && details ? (
        <div
          className={styles.pcard}
          onClick={() => {
            router.push(
              `/movies/${details.movieId}?movie=${details.title.replaceAll(
                " ",
                "-"
              )}&year=${details.year}`
            );
          }}
        >
          {GetPoster(details) !== "" ? (
            <img src={GetPoster(details)} alt={details?.title} />
          ) : (
            <div className={styles.title}>
              {details.title} ({details.year})
            </div>
          )}
        </div>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
