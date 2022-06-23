import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styles from "./Navbar.module.css";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  toDark,
  toLight,
  setTheme,
  setNotifSignIn,
} from "../../redux/features/generalSlice";
import { logout } from "../../redux/features/authSlice";
import MobileNavbar from "./MobileNavbar";
import SearchBar from "./SearchBar/SearchBar";
import SecondaryIcons from "../social_network/SecondaryIcons";
import { ProfilePic } from "../social_network/people/user/Profile";
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
  const notifSignIn = useSelector((state) => state.global.notifSignIn);
  const theme = useSelector((state) => state.global.theme);
  const user = useSelector((state) => state.userAuth.user);
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

  // const [whiteIcons, setWhiteIcons] = useState();
  const [isMobile, setIsMobile] = useState(null);
  const checkWidth = () => {
    if (window.innerWidth > 740) setIsMobile(false);
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
    const timer = setTimeout(() => {
      if (notifSignIn) dispatch(setNotifSignIn(false));
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [notifSignIn]); //eslint-disable-line react-hooks/exhaustive-deps

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
      className={`${styles.navbar} ${navScrollTheme ? styles.toggle_style : ""} 
      ${theme === "dark" ? styles.dark_theme : styles.light_theme}
      ${router.pathname !== "/movies/[id]" ? styles.hold_style : ""}
      `}
    >
      {isMobile !== null && (
        <>
          {!isMobile ? (
            <div className={styles.desktop_nav}>
              <div className={styles.logo} onClick={() => router.push("/home")}>
                <img src="/site-icon/favicon-96x96.png" alt="logo" />
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
              <SearchBar
                prop={{
                  navScrollTheme,
                  theme,
                  isMobile,
                }}
              />
              {authorized ? (
                <div className={styles.nav_options}>
                  <div className={styles.theme} onClick={handleTheme}>
                    {theme === "dark" ? (
                      <ion-icon name="sunny-outline"></ion-icon>
                    ) : (
                      <ion-icon name="moon-outline"></ion-icon>
                    )}
                  </div>

                  <SecondaryIcons isMobile={isMobile} />

                  <ProfilePic url={user.photoUrl} name={user.username} />

                  <div
                    className={styles.logout}
                    onClick={() => {
                      dispatch(logout());
                    }}
                  >
                    <ion-icon name="log-out-outline"></ion-icon>
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
                    className={`${notifSignIn ? styles.shake_it : ""} ${
                      styles.login_btn
                    }
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
                user,
                isMobile,
                handleTheme,
                notifSignIn,
                theme,
                authorized,
              }}
            />
          )}
        </>
      )}

      {/* Mobile version NEED to change according to new Design  */}
    </nav>
  );
}

export default Navbar;
