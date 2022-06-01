import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { logout } from "../../redux/features/authSlice";
import styles from "./Navbar.module.css";
import barStyles from "./SearchBar/searchbar.module.css";
import mnstyle from "./mobilenav.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import SearchBar from "./SearchBar/SearchBar";
import SecondaryIcons from "../social_network/SecondaryIcons";
import { ProfilePic } from "../social_network/people/user/Profile";

const MobileNavbar = ({ prop }) => {
  const [navOpened, setNavOpened] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { handleTheme, navScrollTheme, theme, isMobile, authorized, user } =
    prop;
  return (
    <>
      <div
        className={`${mnstyle.mobilenav} ${
          !navOpened ? mnstyle.notopened : mnstyle.opened
        } ${theme === "light" ? mnstyle.ltheme : mnstyle.dtheme}`}
      >
        <div className={styles.logo} onClick={() => router.push("/home")}>
          <img src="/assets/nav-logo.png" alt="logo" />
        </div>

        <div className={mnstyle.mobnav_icons}>
          {!navOpened && (
            <>
              <div
                className={mnstyle.mobnav_nicon}
                onClick={() => setSearchOpened(true)}
              >
                <ion-icon name="search-outline"></ion-icon>
              </div>
              {authorized ? (
                <SecondaryIcons isMobile={isMobile} />
              ) : (
                <button
                  className={`${mnstyle.mob_login} ${
                    navScrollTheme ? mnstyle.navstyle2 : ""
                  }
                ${
                  navScrollTheme && theme === "dark"
                    ? mnstyle.mob_dtbtn
                    : mnstyle.mob_default
                }
                ${
                  navScrollTheme && theme === "light" ? mnstyle.mob_ltbtn : ""
                }`}
                  id="sign-in"
                  onClick={() => router.push("/login")}
                >
                  Sign in
                </button>
              )}
            </>
          )}
          <div
            onClick={() => setNavOpened(!navOpened)}
            className={`${mnstyle.burger} ${
              navOpened ? mnstyle.opened : mnstyle.notopened
            }`}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <div
        className={`${barStyles.mob_searchbar} ${
          searchOpened ? barStyles.opened : ""
        }`}
      >
        <button onClick={() => setSearchOpened(false)}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <SearchBar prop={{ navScrollTheme, theme, isMobile }} />
        {/* <button onClick={() => setSearchOpened(false)}>cancel</button> */}
      </div>

      <div
        className={`${mnstyle.mobileNavItems} ${
          navOpened ? mnstyle.opened : ""
        }`}
      >
        <ul className={mnstyle.navlinks}>
          <li
            className={`${mnstyle.mob_navlink} ${
              router.pathname === "/home" ? mnstyle.navactive : ""
            }`}
          >
            <Link href="/home" className={mnstyle.home} passHref={true}>
              <div
                className={mnstyle.mobnav_icons}
                onClick={() => setNavOpened(!navOpened)}
              >
                <ion-icon name="home-outline"></ion-icon>
                <h4> Home</h4>
              </div>
            </Link>
          </li>
          <li
            className={`${mnstyle.mob_navlink} ${
              router.pathname === "/movies" ? mnstyle.navactive : ""
            }`}
          >
            <Link href="/movies" className={mnstyle.movies} passHref={true}>
              <div
                className={mnstyle.mobnav_icons}
                onClick={() => setNavOpened(!navOpened)}
              >
                <ion-icon name="videocam-outline"></ion-icon>
                <h4> Movies</h4>
              </div>
            </Link>
          </li>
        </ul>

        <div className={mnstyle.theme} onClick={handleTheme}>
          {theme === "dark" ? (
            <div className={mnstyle.mobnav_icons}>
              <ion-icon name="sunny-outline"></ion-icon>
              <h4>Light theme</h4>
            </div>
          ) : (
            <div className={mnstyle.mobnav_icons}>
              <ion-icon name="moon-outline"></ion-icon>
              <h4>Dark theme</h4>
            </div>
          )}
        </div>

        {authorized && (
          <div className={mnstyle.mob_profile}>
            <div className={mnstyle.mob_user}>
              <ProfilePic url={user.photoUrl} name={user.username} />
              <h4>My Account</h4>
            </div>
            <div
              onClick={() => {
                dispatch(logout());
              }}
              className={`${mnstyle.mob_logout}`}
            >
              <ion-icon name="log-out-outline"></ion-icon>
              <h4>Log out</h4>
            </div>
          </div>
        )}
      </div>
      {navOpened && (
        <div onClick={() => setNavOpened(false)} className={mnstyle.closenav} />
      )}
    </>
  );
};

export default MobileNavbar;
