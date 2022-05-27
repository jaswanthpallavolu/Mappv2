import React, { useEffect, useState } from "react";
import styles from "../iconsection.module.css";
import notifStyles from "./notif.module.css";
import { setNotifications } from "../../../../redux/features/notificationSlice";
import { useSelector, useDispatch } from "react-redux";
export default function Notification() {
  function randomDate(start, end) {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  }
  useEffect(() => {
    // var earlier = new Date().setTime(
    //   new Date().getTime() - 18 * 60 * 60 * 1000
    // );
    // var thisweek = new Date(
    //   new Date().setDate(new Date().getDate() - 7)
    // ).getTime();
    // console.log("t", new Date());
    // var n = 7;
    // var list = [];
    // while (n--) {
    //   list.push(randomDate(new Date(2022, 4, 1), new Date()));
    // }
    // console.log(list);
    // console.log(new Date("Fri May 20 2022 10:06:10 GMT+0530"));
  }, []);

  return (
    <div className={styles.icon_section}>
      <div className={notifStyles.container}>
        <h3 className={notifStyles.title}>Notifications</h3>
        <div className={notifStyles.content}>
          <Section name="new" dropdown={true} />
          <Section name="earlier" dropdown={true} />
          <Section name="this week" dropdown={false} />
          <Section name="older" dropdown={false} />
        </div>
      </div>
    </div>
  );
}

export const Section = ({ name, dropdown }) => {
  const notifications = useSelector(
    (state) => state.userNotifications.notifications
  );
  const [dropdownOpened, setDropdownOpened] = useState(dropdown);
  const [more, setMore] = useState(3);
  const toggleDropdown = () => {
    setDropdownOpened(!dropdownOpened);
  };
  const getDays = (timeStamp) => {
    var t = 24 * 60 * 60 * 1000;
    return Math.floor(
      (new Date().getTime() - new Date(timeStamp).getTime()) / t
    );
  };
  const getHours = (timeStamp) => {
    var oneHour = 60 * 60 * 1000;

    var hr = Math.floor(
      (new Date().getTime() - new Date(timeStamp).getTime()) / oneHour
    );

    if (hr === 0) {
      var min = Math.floor(
        (new Date().getTime() - new Date(timeStamp).getTime()) / (60 * 1000)
      );
      if (min === 0) {
        var sec = Math.floor(
          (new Date().getTime() - new Date(timeStamp).getTime()) / 1000
        );
        return `${sec} sec`;
      }
      return `${min} mins`;
    }

    return `${hr} hrs`;
  };
  const convertTimeInResult = (result) => {
    var res;
    if (name === "earlier" || name === "new") {
      res = result.map((i) => ({
        ...i,
        timeElapsed: getHours(i.timeStamp),
      }));
    } else {
      res = result.map((i) => ({
        ...i,
        timeElapsed: `${getDays(i.timeStamp)} days ago`,
      }));
    }
    res.sort((a, b) => {
      return new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime();
    });
    return res;
  };
  const [notifs, setNotifs] = useState([]);

  const Earlier = (upperLimit, LowerLimit) => {
    var result = notifications.filter(
      (n) =>
        new Date(n.timeStamp).getTime() <= upperLimit &&
        new Date(n.timeStamp).getTime() > LowerLimit
    );
    // console.log(convertTimeInResult(result));

    setNotifs(convertTimeInResult(result));
    // console.log( result);
  };

  const thisWeek = (earlier, thisweek) => {
    var result = notifications.filter(
      (n) =>
        new Date(n.timeStamp).getTime() < earlier &&
        new Date(n.timeStamp).getTime() >= thisweek
    );
    setNotifs(convertTimeInResult(result));
    // console.log(convertTimeInResult(result));
    // console.log(result);
  };

  const older = (thisweek) => {
    var result = notifications.filter(
      (n) => new Date(n.timeStamp).getTime() < thisweek
    );
    setNotifs(convertTimeInResult(result));
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
              if (notif.type === "req-acpt")
                return <RequestAccepted key={notif.id} info={notif} />;
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

//notifaction types
export const RequestAccepted = ({ info }) => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.userNotifications.notifications
  );
  const markAsRead = () => {
    var filtered = notifications.filter((i) => i.id !== info.id);
    dispatch(setNotifications([...filtered, { ...info, unRead: false }]));
    //backend put request
  };
  return (
    <div
      onMouseEnter={() => info.unRead && markAsRead()}
      className={`${notifStyles.notification} ${
        info.unRead ? notifStyles.notify : ""
      }`}
    >
      <img
        src={
          "https://thumbs.dreamstime.com/b/profile-picture-vector-perfect-social-media-other-web-use-125320944.jpg"
        }
        alt="p"
      />
      <div className={notifStyles.details}>
        <div className={notifStyles.msg}>
          <p>
            <b>
              {info.sender.length > 20
                ? info.sender.slice(0, 20) + "..."
                : info.sender}
            </b>{" "}
            <small>{"accepted your friend request"}</small>
          </p>
        </div>
        <small>{info.timeElapsed}</small>
      </div>
    </div>
  );
};
