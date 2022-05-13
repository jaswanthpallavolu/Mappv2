import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toDark, toLight, setTheme } from "../../redux/features/generalSlice";
import { logout } from "../../redux/features/authSlice";
import MobileNavbar from "./MobileNavbar";
import SearchBar from "./SearchBar/SearchBar";
import SecondaryIcons from "./social sections/SecondaryIcons";
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
  const router = useRouter();

  const handleTheme = () => {
    if (theme === "dark") {
      localStorage.setItem("theme", "light");
      dispatch(toLight());
    } else {
      localStorage.setItem("theme", "dark");
      dispatch(toDark());
    }
  };

  const [navScrollTheme, setNavScrollTheme] = useState(false);
  const [whiteIcons, setWhiteIcons] = useState();
  const [isMobile, setIsMobile] = useState();
  const checkWidth = () => {
    if (window.innerWidth > 600) setIsMobile(false);
    else setIsMobile(true);
  };

  const changeBackground = () => {
    // setToggleSideNav(false);
    if (window.scrollY >= 30) {
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
          <div className={styles.logo} onClick={() => router.push("/home")}>
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
          <SearchBar prop={{ navScrollTheme, theme, isMobile }} />
          {authorized ? (
            <div className={styles.profile}>
              <div className={styles.theme} onClick={handleTheme}>
                {theme === "dark" ? (
                  <ion-icon name="sunny-outline"></ion-icon>
                ) : (
                  <ion-icon name="moon-outline"></ion-icon>
                )}
              </div>

              <SecondaryIcons isMobile={isMobile} />

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
            isMobile,
            handleTheme,

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
