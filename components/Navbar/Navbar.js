import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toLight, setTheme } from "../../redux/features/generalSlice";
import { logout } from "../../redux/features/authSlice";
import MobileNavbar from "./MobileNavbar";
// import LogoutIcon from "@mui/icons-material/Logout";
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
  const theme = useSelector((state) => state.global.theme);
  const profileUrl = useSelector((state) => state.userAuth.user.photoUrl);
  // const username = useSelector((state) => state.userAuth.user.username);
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

  const [sIcon, setSIcon] = useState(true); //whether search icon is visible or not
  const [navScrollTheme, setNavScrollTheme] = useState(false);
  const [whiteIcons, setWhiteIcons] = useState();
  const [isMobile, setIsMobile] = useState();
  const checkWidth = () => {
    if (window.innerWidth > 600) setIsMobile(false);
    else setIsMobile(true);
  };
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
      // router.push(`/home`, undefined, { shallow: true });
      // router.back();
      setSIcon(true);
    }
  };
  const goBack = () => {
    searchRef.current.value = "";
    // window.localStorage.removeItem("s-word");
    // router.push("/home", undefined, { shallow: true });
    // router.back();
    setSIcon(true);
  };
  const changeBackground = () => {
    // setToggleSideNav(false);
    if (window.scrollY >= 80) {
      setNavScrollTheme(true);
    } else {
      setNavScrollTheme(false);
    }
  };

  useEffect(() => {
    if (router.pathname === "/movies/[id]") setWhiteIcons(true);
    else setWhiteIcons(false);
  }, [router.pathname]);

  useEffect(() => {
    changeBackground();
    if (word) {
      searchRef.current.value = word;
      setSIcon(false);
    }
    const t = window.localStorage.getItem("theme");
    if (t) dispatch(setTheme(t));
    checkWidth();
    window.addEventListener("resize", checkWidth);
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
      window.removeEventListener("resize", checkWidth);
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <nav
      className={`${styles.navbar} ${navScrollTheme ? styles.navstyle2 : ""} ${
        whiteIcons ? styles.makeWhite : ""
      }`}
      // theme={theme}
    >
      {!isMobile ? (
        <div className={styles.topnav}>
          <div className={styles.logo}>
            <img src="/assets/nav-logo.png" alt="logo" />
          </div>
          <ul className={styles.navlinks}>
            <li
              className={`${styles.navlink} ${
                router.pathname === "/home" ? styles.navactive : ""
              }`}
            >
              <Link href="/home">Home</Link>
            </li>
            <li
              className={`${styles.navlink} ${
                router.pathname === "/movies" ? styles.navactive : ""
              }`}
            >
              <Link href="/movies">Movies</Link>
            </li>
          </ul>

          <form
            className={`${styles.search_bar} 
          ${
            navScrollTheme && theme === "dark"
              ? styles.dtbar
              : styles.bar_default
          }
          ${navScrollTheme && theme === "light" ? styles.ltbar : ""}`}
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
                {theme === "dark" ? (
                  <ion-icon name="sunny-outline"></ion-icon>
                ) : (
                  <ion-icon name="moon-outline"></ion-icon>
                )}
              </div>

              <div className={styles.mylist}>
                <ion-icon name="bookmark-outline"></ion-icon>
                <div className={styles.box}></div>
              </div>
              <div className={styles.notification}>
                <ion-icon name="notifications-outline"></ion-icon>
              </div>
              <div className={styles.friends}>
                <ion-icon name="people-outline"></ion-icon>
              </div>
              <div className={styles.user}>
                <div className={styles.pic}>
                  <img src={profileUrl} alt="profile" />
                </div>
              </div>
              <div className={styles.logout}>
                <ion-icon
                  name="log-out-outline"
                  onClick={() => {
                    dispatch(logout());
                  }}
                ></ion-icon>
              </div>
            </div>
          ) : (
            <div className={styles.login_section}>
              <div className={styles.theme} onClick={handleTheme}>
                {theme === "dark" ? (
                  <ion-icon name="sunny-outline"></ion-icon>
                ) : (
                  <ion-icon name="moon-outline"></ion-icon>
                )}
              </div>
              <button
                className={`${styles.login_btn}
              ${
                navScrollTheme && theme === "dark"
                  ? styles.dtbtn
                  : styles.btn_default
              }
              ${navScrollTheme && theme === "light" ? styles.ltbtn : ""}`}
                id="sign-in"
                onClick={() => router.push("/login")}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      ) : (
        <MobileNavbar
          prop={{
            navScrollTheme,
            profileUrl,
            handleRoute,
            goBack,
            handleTheme,
            searchRef,
            sIcon,
            theme,
            authorized,
          }}
        />
      )}

      {/* Mobile version NEED to change according to new Design  */}
    </nav>
  );
}

export default Navbar;
