import React, { useEffect, useState } from "react";
import styles from "../iconsection.module.css";
import notifStyles from "./notif.module.css";

import { useSelector } from "react-redux";
import { useRouter } from "next/dist/client/router";

import { RequestAccepted, MovieSuggestion } from "./NotifType";
import { TitleHeader } from "../SecondaryIcons";
export default function Notification({ closeAll }) {
  const theme = useSelector((state) => state.global.theme);
  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }

  return (
    <div className={styles.icon_section}>
      <div
        className={`${notifStyles.container} ${
          theme === "dark" ? notifStyles.dtheme : notifStyles.ltheme
        }`}
      >
        <TitleHeader title={"Notifications"} close={closeAll} />
        <div className={styles.custom_scroll}>
          <Section name="new" dropdown={true} />
          <Section name="earlier" dropdown={true} />
          <Section name="this week" dropdown={false} />
          <Section name="older" dropdown={false} />
        </div>
      </div>
    </div>
  );
}

const getDays = (createdAt) => {
  var t = 24 * 60 * 60 * 1000;
  return Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / t);
};
const getHours = (createdAt) => {
  var oneHour = 60 * 60 * 1000;

  var hr = Math.floor(
    (new Date().getTime() - new Date(createdAt).getTime()) / oneHour
  );

  if (hr === 0) {
    var min = Math.floor(
      (new Date().getTime() - new Date(createdAt).getTime()) / (60 * 1000)
    );
    if (min === 0) {
      var sec = Math.floor(
        (new Date().getTime() - new Date(createdAt).getTime()) / 1000
      );
      return `${sec} sec`;
    }
    return `${min} mins`;
  }

  return `${hr} hrs`;
};
const convertTimeInResult = (name, result) => {
  var res;
  if (name === "earlier" || name === "new") {
    res = result.map((i) => ({
      ...i,
      timeElapsed: getHours(i.createdAt),
    }));
  } else {
    res = result.map((i) => ({
      ...i,
      timeElapsed: `${getDays(i.createdAt)} days ago`,
    }));
  }
  res.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return res;
};

export const Section = ({ name, dropdown }) => {
  const router = useRouter();
  const notifications = useSelector(
    (state) => state.userNotifications.notifications
  );
  const [dropdownOpened, setDropdownOpened] = useState(dropdown);
  const [more, setMore] = useState(3);
  const toggleDropdown = () => {
    setDropdownOpened(!dropdownOpened);
  };

  const [notifs, setNotifs] = useState([]);

  const Earlier = (upperLimit, LowerLimit) => {
    var result = notifications.filter(
      (n) =>
        new Date(n.createdAt).getTime() <= upperLimit &&
        new Date(n.createdAt).getTime() > LowerLimit
    );
    // console.log(convertTimeInResult(result));

    setNotifs(convertTimeInResult(name, result));
    // console.log( result);
  };

  const thisWeek = (earlier, thisweek) => {
    var result = notifications.filter(
      (n) =>
        new Date(n.createdAt).getTime() < earlier &&
        new Date(n.createdAt).getTime() >= thisweek
    );
    setNotifs(convertTimeInResult(name, result));
    // console.log(convertTimeInResult(result));
    // console.log(result);
  };

  const older = (thisweek) => {
    var result = notifications.filter(
      (n) => new Date(n.createdAt).getTime() < thisweek
    );
    setNotifs(convertTimeInResult(name, result));
    // console.log(convertTimeInResult(result));
  };

  const fetchNotifs = () => {
    const hrs = 24 * 60 * 60 * 1000;
    var newLimit = new Date().setTime(new Date().getTime() - 15 * 60 * 1000);
    var earlier = new Date().setTime(new Date().getTime() - hrs);
    var thisweek = new Date(
      new Date().setDate(new Date().getDate() - 7)
    ).getTime();
    switch (name) {
      case "new":
        Earlier(new Date().getTime(), newLimit);
        break;
      case "earlier":
        Earlier(newLimit, earlier);
        break;
      case "this week":
        thisWeek(earlier, thisweek);
        break;
      case "older":
        older(thisweek);
        break;
      default:
        "";
    }
  };

  useEffect(() => {
    if (notifications) fetchNotifs();
  }, [notifications]);

  return (
    <>
      {/* {notifs.length > 0 && ( */}
      <div className={notifStyles.section}>
        <div
          className={`${notifStyles.dropdown} ${
            dropdownOpened && notifs.length ? notifStyles.expand : ""
          }
          ${
            !dropdownOpened &&
            notifs.filter((n) => n.unRead === true).length > 0
              ? notifStyles.notify
              : ""
          } `}
          onClick={toggleDropdown}
        >
          <h5>{name}</h5>
          <i className="fa-solid fa-caret-down"></i>
          <small>[{notifs.length}]</small>
        </div>
        {dropdownOpened && (
          <div className={notifStyles.section_notifications}>
            {notifs?.slice(0, more).map((notif) => {
              if (notif.type === "request-accepted")
                return (
                  <RequestAccepted
                    key={notif._id}
                    info={notif}
                    router={router}
                  />
                );
              else if (notif.type === "movie-suggestion")
                return (
                  <MovieSuggestion
                    key={notif._id}
                    info={notif}
                    router={router}
                  />
                );
              else return "";
            })}
            {more < notifs.length && (
              <button
                className={notifStyles.more}
                onClick={() => setMore(more + 4)}
              >
                more
              </button>
            )}
          </div>
        )}
      </div>
      {/* )} */}
    </>
  );
};
