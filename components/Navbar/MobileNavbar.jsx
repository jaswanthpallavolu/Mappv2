import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/features/authSlice";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";

const MobileNavbar = ({ prop }) => {
  const [navOpened, setNavOpened] = useState(false);
  const [navScrollTheme, setNavScrollTheme] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { word } = router.query;
  const {
    handleRoute,
    handleTheme,
    goBack,
    searchRef,
    authorized,
    theme,
    profileUrl,
  } = prop;

  // const changeBackground = () => {
  //   // setToggleSideNav(false);
  //   if (window.scrollY >= 80) {
  //     setNavScrollTheme(true);
  //   } else {
  //     setNavScrollTheme(false);
  //   }
  // };

  // useEffect(() => {
  //   changeBackground();
  //   if (word) {
  //     searchRef.current.value = word;
  //     setSIcon(false);
  //   }
  //   const t = window.localStorage.getItem("theme");
  //   if (t) dispatch(setTheme(t));
  //   checkWidth();
  //   window.addEventListener("resize", checkWidth);
  //   window.addEventListener("scroll", changeBackground);
  //   return () => {
  //     window.removeEventListener("scroll", changeBackground);
  //     window.removeEventListener("resize", checkWidth);
  //   };
  // }, []); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div
        className={`${styles.mobilenav} ${
          !navOpened ? styles.notopened : styles.opened
        }`}
      >
        <div className={styles.logo}>
          <img src="/assets/nav-logo.png" alt="logo" />
        </div>

        <div className={styles.mobnav_icons}>
          {!navOpened ? (
            <>
              <div className={styles.mobnav_nicon}>
                <ion-icon name="search-outline"></ion-icon>
              </div>
              {authorized ? (
                <>
                  <div className={`${styles.mobnav_nicon} ${styles.notify}`}>
                    <ion-icon name="bookmark-outline"></ion-icon>
                  </div>
                  <div className={styles.mobnav_nicon}>
                    <ion-icon name="notifications-outline"></ion-icon>
                  </div>
                  <div className={styles.mobnav_nicon}>
                    <ion-icon name="people-outline"></ion-icon>
                  </div>
                </>
              ) : (
              <button
                className={`${styles.mob_login} ${navScrollTheme ? styles.navstyle2 : ""}
                ${
                  navScrollTheme && theme === "dark"
                    ? styles.mob_dtbtn
                    : styles.mob_default
                }
                ${navScrollTheme && theme === "light" ? styles.mob_ltbtn : ""}`}
                  id="sign-in"
                  onClick={() => router.push("/login")}
                >
                  Sign in
              </button>
              )}
            </>
          ) : (
            ""
          )}
          <div
            onClick={() => setNavOpened(!navOpened)}
            className={`${styles.burger} ${
              navOpened ? styles.opened : styles.notopened
            }`}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div
        className={`${styles.mobileNavItems} ${navOpened ? styles.opened : ""}`}
      >
        <ul className={styles.navlinks}>
          <li
            onClick={() => setNavOpened(!navOpened)}
            className={`${styles.mob_navlink} ${
              router.pathname === "/home" ? styles.navactive : ""
            }`}
          >
            <Link href="/home" className={styles.home}>
              <div className={styles.mobnav_icons}>
                <ion-icon name="home-outline"></ion-icon>
                <h4> Home</h4>
              </div>
            </Link>
          </li>
          <li
            onClick={() => setNavOpened(!navOpened)}
            className={`${styles.mob_navlink} ${
              router.pathname === "/movies" ? styles.navactive : ""
            }`}
          >
            <Link href="/movies" className={styles.movies}>
              <div className={styles.mobnav_icons}>
                <ion-icon name="videocam-outline"></ion-icon>
                <h4> Movies</h4>
              </div>
            </Link>
          </li>
        </ul>

        <div className={styles.theme} onClick={handleTheme}>
          {theme === "dark" ? (
            <div className={styles.mobnav_icons}>
              <ion-icon name="sunny-outline"></ion-icon>
              <h4> Dark theme</h4>
            </div>
          ) : (
            <div className={styles.mobnav_icons}>
              <ion-icon name="moon-outline"></ion-icon>
              <h4> Light theme</h4>
            </div>
          )}
        </div>

        {authorized ? (
          <div className={styles.mob_profile}>
            <div className={styles.mob_user}>
              <div className={styles.pic}>
                <img src={profileUrl} alt="profile" />
              </div>
              <h4>My Account</h4>
            </div>
            <div className={`${styles.mob_logout} ${styles.mobnav_icons}`}>
              <ion-icon
                name="log-out-outline"
                onClick={() => {
                  dispatch(logout());
                }}
              ></ion-icon>{" "}
              <h4>Log out</h4>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {navOpened ? (
        <div onClick={() => setNavOpened(false)} className={styles.closenav} />
      ) : (
        ""
      )}
    </>
  );
};

export default MobileNavbar;
