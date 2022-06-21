import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./searchbar.module.css";
import customStyles from "../../../styles/customstyles.module.css";
import axios from "axios";
import { Loader1 } from "../.././../utils/loaders/Loading";

const SearchBar = ({ prop }) => {
  const { navScrollTheme, theme, isMobile } = prop;
  const searchRef = useRef();

  const [showClear, setShowClear] = useState(false);
  const router = useRouter();
  const { word } = router.query;
  const [searchValue, setSearchValue] = useState("");
  const [showSuggBox, setShowSuggBox] = useState(false);
  const [onHovered, setOnHovered] = useState(false);
  const [recent, setRecent] = useState([]);
  const [suggs, setSuggs] = useState(null);

  const handleRouteChange = () => {
    setShowSuggBox(false);
    var word = searchValue;
    if (word) router.push(`/search/${word}`);
  };

  const searchMovie = (e) => {
    if (e.key === "Enter") handleRouteChange();
  };
  const manageClearIcon = (e) => {
    setSearchValue(e.target.value);
    if (e.target.value === "") setShowClear(false);
    else setShowClear(true);
  };
  const getRecentSearchList = () => {
    var recentList = JSON.parse(
      window.localStorage.getItem("search-recent") || "[]"
    );

    recentList.reverse();
    setRecent(recentList);

    // console.log("r", recentList);
  };

  useEffect(() => {
    if (searchValue) {
      setShowClear(true);
    } else setShowClear(false);
  }, [router.pathname, searchValue]);

  useEffect(() => {
    if (word) setSearchValue(word);
    if (searchValue !== "") setShowClear(true);
    getRecentSearchList();
  }, [word]);

  return (
    <div
      className={`${styles.search_bar}  ${styles.bar_default}
    ${(navScrollTheme || isMobile) && theme === "dark" ? styles.dtbar : ""}
    ${(navScrollTheme || isMobile) && theme === "light" ? styles.ltbar : ""}`}
      id="search_bar"
      onKeyPress={searchMovie}
      onBlur={() => {
        !onHovered && setShowSuggBox(false);
      }}
    >
      <ion-icon className={styles.searchIcon} name="search-outline"></ion-icon>
      <div className={styles.input}>
        <input
          type="text"
          ref={searchRef}
          placeholder="search movies by title, tags, genres"
          value={searchValue}
          onChange={manageClearIcon}
          onFocus={() => {
            setShowSuggBox(true);
          }}
        />

        {showClear ? (
          <div
            onClick={() => {
              setSearchValue("");
              setShowClear(false);
              searchRef.current.focus();
            }}
          >
            <ion-icon
              className={styles.closeIcon}
              name="close-outline"
              title="none"
            ></ion-icon>
          </div>
        ) : (
          ""
        )}
      </div>
      {showSuggBox && (
        <Suggestions
          props={{
            suggs,
            setSuggs,
            recent,
            setRecent,
            setSearchValue,
            setShowSuggBox,
            setOnHovered,
            searchValue,
            router,
          }}
        />
      )}
    </div>
  );
};

export default SearchBar;

function Suggestions({ props }) {
  const {
    suggs,
    setSuggs,
    setSearchValue,
    recent,
    setRecent,
    setOnHovered,
    setShowSuggBox,
    searchValue,
    router,
  } = props;

  const [loading, setLoading] = useState(false);
  const fetchSuggestions = async (signal) => {
    // console.log("ftch");
    setLoading(true);
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/search/matches/${searchValue}`,
        { signal }
      )
      .then((res) => {
        setSuggs(
          res.data.suggestions?.map((i) => ({ sugg: i, type: "suggestion" }))
        );
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const deleteSugg = (sug) => {
    var list = recent;
    list = list.filter((i) => i !== sug);
    setRecent(list);
    // list = list?.map((i) => ({ sugg: i, type: "recent" }));
    // setSuggs(list);
    window.localStorage.setItem("search-recent", JSON.stringify(list));
  };
  const goToRoute = (name) => {
    setShowSuggBox(false);
    setSearchValue(name);

    var list = recent.slice(-5);
    list.push(name);
    list = [...new Set(list)];
    // console.log("add", list);
    setRecent(list);

    window.localStorage.setItem("search-recent", JSON.stringify(list));
    router.push(`/search/${name}`);
  };

  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      if (searchValue === "") {
        var list = recent?.map((i) => ({ sugg: i, type: "recent" }));
        // console.log("rec");
        if (JSON.stringify(list) !== JSON.stringify(suggs)) setSuggs(list);
      } else fetchSuggestions(controller.signal);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
      setLoading(false);
    };
  }, [searchValue.replaceAll(" ", ""), recent]);

  // useEffect(() => {
  //   return () => setSuggs([]);
  // }, []);
  // useEffect(() => {
  //   const controller = new AbortController();

  //   if (searchValue === "") {
  //     var list = recent?.map((i) => ({ sugg: i, type: "recent" }));
  //     setSuggs(list);
  //   } else {
  //     fetchSuggestions(controller.signal);
  //   }

  //   return () => {
  //     controller.abort();
  //   };
  // }, []);

  return (
    <ul
      className={`${styles.suggestions} ${customStyles.custom_scrollbar}`}
      onMouseEnter={() => setOnHovered(true)}
      onMouseOver={() => setOnHovered(true)}
      onMouseLeave={() => setOnHovered(false)}
    >
      {!loading &&
        suggs?.map((i, index) => {
          if (i.type === "suggestion")
            return (
              <li key={index} className={styles.sugg}>
                <i className="fa-solid fa-magnifying-glass"></i>
                <p onClick={() => goToRoute(i.sugg)}>{i.sugg}</p>
              </li>
            );
          else
            return (
              <li key={index} className={`${styles.sugg} ${styles.rsugg}`}>
                {/* <div className={styles.recent}> */}
                <i className="fa-solid fa-clock-rotate-left"></i>
                <p onClick={() => goToRoute(i.sugg)}>{i.sugg}</p>
                {/* </div> */}
                <div
                  className={styles.delete}
                  onClick={() => deleteSugg(i.sugg)}
                >
                  <i className="fa-solid fa-trash-can"></i>
                </div>
              </li>
            );
        })}
      {!loading && searchValue !== "" && suggs?.length === 0 && (
        <li className={styles.no_match}>no matches found</li>
      )}
      {loading && (
        <div className={styles.loader_sec}>
          {" "}
          <Loader1 />
        </div>
      )}
    </ul>
  );
}
