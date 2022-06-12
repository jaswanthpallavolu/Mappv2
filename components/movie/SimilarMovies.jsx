import React from "react";
import { useEffect, useState } from "react";
import styles from "./Recommends.module.css";
import styles2 from "./MovieDetails.module.css";
import customStyles from "../../styles/customstyles.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import Skeleton from "../../utils/skeleton/Skeleton";

export default function Recommends({ details }) {
  const [recommended_movies, setRecommended_movies] = useState();
  const [loading, setLoading] = useState(true);

  async function fetchMovies(signal) {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/recommend/contentbased/${details.movieId}`,
        { signal }
      )
      .then((data) => {
        const res = data.data;
        setRecommended_movies(res.result.slice(0, 8));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // setLoading(false);
      });
  }

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    if (details.movieId) fetchMovies(controller.signal);
    return () => {
      controller.abort();
    };
  }, [details.movieId]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!loading ? (
        <ul className={`${styles.rec_container}`}>
          <li>
            <h6 className={styles2.sec_header}>Similar Movies</h6>
          </li>

          <ul className={`${styles.cards}  ${customStyles.custom_scrollbar}`}>
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
    setLoading(true);
    fetchMovie(controller.signal);
    return () => controller.abort();
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
