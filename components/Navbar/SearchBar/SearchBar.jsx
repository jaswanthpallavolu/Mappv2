import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./searchbar.module.css";
import customStyles from "../../../styles/customstyles.module.css";
import axios from "axios";

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

  const handleRouteChange = () => {
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
  }, []);

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
    setSearchValue,
    recent,
    setRecent,
    setOnHovered,
    setShowSuggBox,
    searchValue,
    router,
  } = props;
  const [suggs, setSuggs] = useState(null);

  const fetchSuggestions = async (signal) => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_MOVIE_SERVER}/movies/search/matches/${searchValue}`,
        { signal }
      )
      .then((res) =>
        setSuggs(
          res.data.suggestions?.map((i) => ({ sugg: i, type: "suggestion" }))
        )
      )
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
        // var list = recent;
        var list = recent?.map((i) => ({ sugg: i, type: "recent" }));
        // console.log(list);
        setSuggs(list);
      } else fetchSuggestions(controller.signal);
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchValue.replaceAll(" ", ""), recent]);

  useEffect(() => {
    const controller = new AbortController();

    if (searchValue === "") {
      var list = recent?.map((i) => ({ sugg: i, type: "recent" }));
      setSuggs(list);
    } else fetchSuggestions(controller.signal);

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <ul
      className={`${styles.suggestions} ${customStyles.custom_scrollbar}`}
      onMouseEnter={() => setOnHovered(true)}
      onMouseOver={() => setOnHovered(true)}
      onMouseLeave={() => setOnHovered(false)}
    >
      {suggs?.map((i, index) => {
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
              <div className={styles.delete} onClick={() => deleteSugg(i.sugg)}>
                <i className="fa-solid fa-trash-can"></i>
              </div>
            </li>
          );
      })}
      {searchValue !== "" && suggs?.length === 0 && (
        <li className={styles.no_match}>no matches found</li>
      )}
    </ul>
  );
}
