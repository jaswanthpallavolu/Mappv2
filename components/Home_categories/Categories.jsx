import React, { useEffect, useState } from "react";

import axios from "axios";
import styles from "./sections.module.css";
import { useSelector } from "react-redux";
import LazyLoad from "../../utils/lazyLoad/LazyLoad";
import MyList from "./MyList";
// const MyList = React.lazy(() => import("./MyList"));
// const { Recommend, CategoryTemplate, Category, Tag } = React.lazy(() =>
//   import("./category")
// );
import { Recommend, CategoryTemplate, Category, Tag } from "./category";
// import LazyLoad from "react-lazy-load";

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
        // console.log(res.data);
        setMostLiked(res.data.mostLiked);
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    if (user.authorized) fetchMostLiked(controller.signal);
    return () => controller.abort();
  }, [user.authorized]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setLoading(true);
    // if (historyStatus === "loaded" || !user.authorized) fetchTags(signal);

    return () => controller.abort();
  }, [historyStatus]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={styles.home_categories}>
      {user.authorized && <MyList />}

      {user.authorized ? (
        <>
          <Recommend name="collaborative" />
          {mostLiked?.length && (
            <LazyLoad>
              <CategoryTemplate name="most liked by friends" list={mostLiked} />
            </LazyLoad>
          )}
        </>
      ) : (
        <p className={styles.suggest_text}>
          &quot; Login and like <i className="far fa-thumbs-up"></i> movies to
          get Recommendations &quot;
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
