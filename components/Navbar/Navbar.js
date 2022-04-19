import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toLight, setTheme } from "../../redux/features/themeSlice";
import { logout } from "../../redux/features/authSlice";

import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import LogoutIcon from "@mui/icons-material/Logout";
// import styled from "styled-components";

// const Nav = styled.div.attrs((props) => ({
//   className: props.active ? "active" : "",
// }))`
//   background-color: ${(props) => (props.active ? "var(--primary)" : "")};
//   box-shadow: ${(props) =>
//     props.active ? "0px 1px 3px rgba(0,0,0,0.25) " : ""};
// `;

// const Sbar = styled.div`

// ${({active,theme})=> active && theme==='dark' `background-color: rgba(255,255,255,.95) !important`

//   // background-color: ${(props) =>
//   //   props.active && props.theme === "dark"
//   //     ? "rgba(255,255,255,.95) !important"
//   //     : ""};
// `;

function Navbar() {
  const theme = useSelector((state) => state.theme.value);
  const pUrl = useSelector((state) => state.currentUser.user.photoUrl);
  const username = useSelector((state) => state.currentUser.user.username);
  const dispatch = useDispatch();
  const searchRef = useRef();
  const router = useRouter();
  const { word } = router.query;

  const handleTheme = () => {
    if (theme === "dark") {
      localStorage.setItem("theme", "light");
      dispatch(toLight());
    } else {
      localStorage.setItem("theme", "dark");
      dispatch(toDark());
    }
  };

  const [toggleSideNav, setToggleSideNav] = useState(false);
  const [toggle, setToggle] = useState();
  const [toggleNav, setToggleNav] = useState(false);
  const handleRoute = () => {
    var word = searchRef.current.value;
    if (word) {
      // window.localStorage.setItem("s-word", word);
      router.push(`/home/${word}`, undefined, { shallow: true });
      setToggle(true);
    } else {
      // window.localStorage.setItem("s-word", word);
      router.push(`/home`, undefined, { shallow: true });
      setToggle(false);
    }
  };
  const handleIcon = () => {
    searchRef.current.value = "";
    window.localStorage.removeItem("s-word");
    router.push("/home", undefined, { shallow: true });
    setToggle(false);
  };
  const changeBackground = () => {
    setToggleSideNav(false);
    if (window.scrollY >= 80) {
      setToggleNav(true);
    } else {
      setToggleNav(false);
    }
  };
  useEffect(() => {
    if (word) {
      window.localStorage.setItem("s-word", word);
      searchRef.current.value = word;
      setToggle(true);
    } else {
      searchRef.current.value = "";
      setToggle(false);
    }
  }, [word]);

  useEffect(() => {
    changeBackground();
    const t = window.localStorage.getItem("theme");
    if (t) dispatch(setTheme(t));
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav
      className={`${styles.navbar} ${toggleNav ? styles.navstyle2 : ""}`}
      // active={toggleNav}
      theme={theme}
    >
      <div className={styles.topnav}>
        <div
          onClick={() => setToggleSideNav(!toggleSideNav)}
          className={styles.burger}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div
          className={`${styles.search_bar} 
          ${toggleNav && theme === "dark" ? styles.dtbar : styles.bar_default}
          ${toggleNav && theme === "light" ? styles.ltbar : ""}`}
          id="search_bar"
        >
          <input
            type="text"
            placeholder="search movie"
            ref={searchRef}
            onChange={handleRoute}
          />
          <button>
            {toggle ? (
              <img
                onClick={handleIcon}
                src="/assets/x-mark-thin.png"
                alt="hh"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <img src="/assets/search-thin.png" alt="hh" />
            )}
          </button>
        </div>

        <div className={styles.profile}>
          <div className={styles.theme} onClick={handleTheme}>
            {theme === "dark" ? <WbSunnyIcon /> : <Brightness2Icon />}
          </div>
          <div className={styles.name}>{username}</div>
          <div className={styles.user}>
            <div className={styles.pic}>
              <img src={pUrl} alt="profile" />
            </div>
            <div className={styles.logout}>
              <LogoutIcon
                onClick={() => {
                  dispatch(logout());
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        style={{ height: toggleSideNav ? "20vh" : "0" }}
        className={styles.sidenav}
      >
        {!toggleSideNav ? (
          ""
        ) : (
          <div className={styles.sn_profile}>
            <div className={styles.theme} onClick={handleTheme}>
              {theme === "dark" ? <WbSunnyIcon /> : <Brightness2Icon />}
            </div>
            <div className={styles.name}>{username}</div>
            <div className={styles.user}>
              <div className={styles.pic}>
                <img src={pUrl} alt="profile" />
              </div>
              <div className={styles.logout}>
                <LogoutIcon
                  onClick={() => {
                    dispatch(logout());
                    // router.replace("/login");
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
