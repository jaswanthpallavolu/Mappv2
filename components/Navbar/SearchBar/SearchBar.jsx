import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./searchbar.module.css";

const SearchBar = ({ prop }) => {
  const { navScrollTheme, theme, isMobile } = prop;
  const searchRef = useRef();
  const router = useRouter();
  const { word } = router.query;
  const [showClear, setShowClear] = useState(true); //whether search icon is visible or not
  const handleRoute = () => {
    var word = searchRef.current.value;
    if (word) router.push(`/search/${word}`);
  };

  const searchMovie = (e) => {
    if (e.key === "Enter") handleRoute();
  };
  const manageClearIcon = () => {
    if (searchRef.current.value === "") setShowClear(false);
    else setShowClear(true);
  };

  useEffect(() => {
    if (word) {
      searchRef.current.value = word;
      setShowClear(true);
    } else setShowClear(false);
  }, [word]);
  return (
    <div
      className={`${styles.search_bar} 
    ${
      (navScrollTheme || isMobile) && theme === "dark"
        ? styles.dtbar
        : styles.bar_default
    }
    ${(navScrollTheme || isMobile) && theme === "light" ? styles.ltbar : ""}`}
      id="search_bar"
      onKeyPress={searchMovie}
    >
      <ion-icon className={styles.searchIcon} name="search-outline"></ion-icon>
      <div className={styles.input}>
        <input
          type="text"
          placeholder="search movie"
          ref={searchRef}
          onChange={manageClearIcon}
        />

        {showClear ? (
          <div
            onClick={() => {
              searchRef.current.value = "";
              setShowClear(false);
            }}
          >
            <ion-icon
              className={styles.closeIcon}
              name="close-outline"
            ></ion-icon>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SearchBar;
