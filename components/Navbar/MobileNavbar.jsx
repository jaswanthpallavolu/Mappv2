import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/features/authSlice";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { SearchBar } from "./Navbar";

const MobileNavbar = ({ prop }) => {
  const [navOpened, setNavOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    handleTheme,
    navScrollTheme,
    theme,
    isMobile,
    authorized,

    profileUrl,
  } = prop;
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
          {!navOpened && (
            <>
              <div
                className={styles.mobnav_nicon}
                onClick={() => setSearchOpened(true)}
              >
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
                <button onClick={() => router.push("/login")}>Signin</button>
              )}
            </>
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
        className={`${styles.mob_searchbar} ${
          searchOpened ? styles.opened : ""
        }`}
      >
        <SearchBar prop={{ navScrollTheme, theme, isMobile }} />
        <button onClick={() => setSearchOpened(false)}>cancel</button>
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
              <h4>Light theme</h4>
            </div>
          ) : (
            <div className={styles.mobnav_icons}>
              <ion-icon name="moon-outline"></ion-icon>
              <h4>Dark theme</h4>
            </div>
          )}
        </div>

        {authorized && (
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
        )}
      </div>
      {navOpened && (
        <div onClick={() => setNavOpened(false)} className={styles.closenav} />
      )}
    </>
  );
};

export default MobileNavbar;
