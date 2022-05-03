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
  const pUrl = useSelector((state) => state.userAuth.user.photoUrl);
  const username = useSelector((state) => state.userAuth.user.username);
  const authorized = useSelector((state) => state.userAuth.user.authorized);

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
  const [sIcon, setSIcon] = useState(true); //whether search icon is visible or not
  const [toggleNav, setToggleNav] = useState(false);
  const handleRoute = (e) => {
    e.preventDefault();
    // if (!sIcon) return;
    var word = searchRef.current.value;
    if (word) {
      // window.localStorage.setItem("s-word", word);
      router.push(`/search/${word}`, undefined, { shallow: true });
      setSIcon(false);
    } else {
      // window.localStorage.setItem("s-word", word);
      router.push(`/home`, undefined, { shallow: true });
      // router.back();
      setSIcon(true);
    }
  };
  const goBack = () => {
    searchRef.current.value = "";
    // window.localStorage.removeItem("s-word");
    router.push("/home", undefined, { shallow: true });
    // router.back();
    setSIcon(true);
  };
  const changeBackground = () => {
    setToggleSideNav(false);
    if (window.scrollY >= 80) {
      setToggleNav(true);
    } else {
      setToggleNav(false);
    }
  };

  // useEffect(() => {
  //   if (word) {
  //     window.localStorage.setItem("s-word", word);
  //     searchRef.current.value = word;
  //     setToggle(true);
  //   } else {
  //     searchRef.current.value = "";
  //     setToggle(false);
  //   }
  // }, [word]);

  useEffect(() => {
    changeBackground();
    if (word) {
      searchRef.current.value = word;
      setSIcon(false);
    }
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
        <div className={styles.logo}>
          <img src="/assets/nav-logo.png" alt="logo" />
        </div>
        {/* <div
          onClick={() => setToggleSideNav(!toggleSideNav)}
          className={styles.burger}
        >
          <span></span>
          <span></span>
          <span></span>
        </div> */}
        <div className={styles.navlinks}>
          <ul>
            <li className={styles.home}><a href="home">Home</a></li>
            <li className={styles.movies}><a href="movies">Movies</a></li>
          </ul>
        </div>
        <form
          className={`${styles.search_bar} 
          ${toggleNav && theme === "dark" ? styles.dtbar : styles.bar_default}
          ${toggleNav && theme === "light" ? styles.ltbar : ""}`}
          id="search_bar"
        >
          <input
            type="text"
            placeholder="search movie"
            ref={searchRef}
            // onChange={handleRoute}
            // onKeyPress={handleRoute}
          />
          <button onClick={handleRoute}>
            {!sIcon ? (
              <img
                onClick={goBack}
                src="/assets/x-mark-thin.png"
                alt="hh"
                style={{ cursor: "pointer" }}
              />
            ) : (
              <img src="/assets/search-thin.png" alt="hh" />
            )}
          </button>
        </form>

        {authorized ? (
          <div className={styles.profile}>
            <div className={styles.theme} onClick={handleTheme}>
              {theme === "dark" ? <ion-icon name="sunny-outline"></ion-icon> : <ion-icon name="moon-outline"></ion-icon>}
            </div>
            {/* <div className={styles.name}>{username}</div> */}
            <div className={styles.mylist}><ion-icon name="bookmark-outline"></ion-icon></div>
            <div className={styles.notification}><ion-icon name="notifications-outline"></ion-icon></div>
            <div className={styles.friends}><ion-icon name="people-outline"></ion-icon></div>
            <div className={styles.user}>
              <div className={styles.pic}>
                <img src={pUrl} alt="profile" />
              </div>
            </div>
            <div className={styles.logout}>
              <LogoutIcon
                onClick={() => {
                  dispatch(logout());
                }}
              />
            </div>
          </div>
        ) : (
          <div className={styles.login_section}>
            <div className={styles.theme} onClick={handleTheme}>
              {theme === "dark" ? <ion-icon name="sunny-outline"></ion-icon> : <ion-icon name="moon-outline"></ion-icon>}
            </div>
            <button
              className={`${styles.login_btn}
              ${toggleNav && theme === "dark" ? styles.dtbtn : styles.btn_default}
              ${toggleNav && theme === "light" ? styles.ltbtn : ""}`}
              id="sign-in"
              onClick={() => router.push("/login")}
            >
              Sign in
            </button>
          </div>
        )}
      </div>

      {/* Mobile version NEED to change according to new Design  */}
      <div
        style={{ height: toggleSideNav ? "20vh" : "0" }}
        className={styles.sidenav}
      >
        {toggleSideNav && authorized ? (
          <div className={styles.sn_profile}>
            <div className={styles.theme} onClick={handleTheme}>
              {theme === "dark" ? <ion-icon name="sunny-outline"></ion-icon> : <ion-icon name="moon-outline"></ion-icon>}
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
        ) : (
          ""
        )}
      </div>
    </nav>
  );
}

export default Navbar;
