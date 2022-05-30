import React, { useEffect, useState } from "react";
import navstyles from "../Navbar.module.css";
import styles from "./iconsection.module.css";
import People from "./people/People";
import Notification from "./notifications/Notification";
import MyList from "./mylist/MyList";
import {
  setNotifications,
  fetchNotifications,
} from "../../../redux/features/notificationSlice";
import {
  setOnlineUsers,
  setReceivedRequest,
  setFriends,
} from "../../../redux/features/peopleSlice";
import { socket } from "../../Layout";
import { useDispatch, useSelector } from "react-redux";

export default function SecondaryIcons({ isMobile }) {
  const [sectionOpened, setSectionOpened] = useState({
    mylist: false,
    notification: false,
    people: false,
  });
  const closeAll = () => {
    setSectionOpened({
      mylist: false,
      notification: false,
      people: false,
    });
  };
  useEffect(() => {
    if (
      (sectionOpened.mylist ||
        sectionOpened.notification ||
        sectionOpened.people) &&
      isMobile
    ) {
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "visible";
  }, [sectionOpened, isMobile]);
  return (
    <>
      <MyListIcon
        setSectionOpened={setSectionOpened}
        sectionOpened={sectionOpened}
        isMobile={isMobile}
        closeAll={closeAll}
      />
      <NotificationIcon
        setSectionOpened={setSectionOpened}
        sectionOpened={sectionOpened}
        isMobile={isMobile}
        closeAll={closeAll}
      />
      <PeopleIcon
        setSectionOpened={setSectionOpened}
        sectionOpened={sectionOpened}
        isMobile={isMobile}
        closeAll={closeAll}
      />

      {/* BACKDROP FOR SECTION CLOSER */}
      {(sectionOpened.mylist ||
        sectionOpened.notification ||
        sectionOpened.people) &&
        !isMobile && (
          <div
            onClick={() =>
              setSectionOpened({
                mylist: false,
                notification: false,
                people: false,
              })
            }
            className={styles.close_section}
          />
        )}
    </>
  );
}

export const MyListIcon = ({
  sectionOpened,
  setSectionOpened,
  isMobile,
  closeAll,
}) => {
  return (
    <>
      <div
        className={`${navstyles.secondary_icon}   ${styles.icon} ${
          sectionOpened.mylist ? styles.active : ""
        } ${isMobile ? navstyles.mobnav_nicon : ""} ${navstyles.disable}`}
      >
        <div
          onClick={() => {
            setSectionOpened({
              mylist: !sectionOpened.mylist,
              notification: false,
              people: false,
            });
          }}
        >
          <ion-icon name="bookmark-outline"></ion-icon>
        </div>
        {sectionOpened.mylist && !isMobile && <MyList />}
      </div>
      {sectionOpened.mylist && isMobile && (
        <div className={styles.mobile_close_sec}>
          <MyList />
          <div className={styles.close_section} onClick={closeAll}></div>
        </div>
      )}
    </>
  );
};

export const NotificationIcon = ({
  sectionOpened,
  setSectionOpened,
  isMobile,
  closeAll,
}) => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.userNotifications.notifications
  );
  const uid = useSelector((state) => state.userAuth.user.uid);

  const addNotification = ({ request }) => {
    console.log("new-notif");
    dispatch(setNotifications([...notifications, request]));
  };
  const removeNotification = ({ request }) => {
    console.log("deleted-notif");
    dispatch(
      setNotifications(notifications.filter((n) => n._id !== request._id))
    );
    // dispatch(setNotifications([...notifications, { ...res }]));
  };
  useEffect(() => {
    socket.on("receive-new-notification", addNotification);
    socket.on("remove-notification", removeNotification);

    return () => {
      socket.off("receive-new-notification", addNotification);
      socket.off("remove-notification", removeNotification);
    };
  }, [socket]);
  useEffect(() => {
    dispatch(fetchNotifications(uid));
  }, []);
  return (
    <>
      <div
        className={`${navstyles.secondary_icon}  ${
          sectionOpened.notification ? styles.active : ""
        } ${
          !sectionOpened.notification &&
          notifications.filter((n) => n.unRead === true).length > 0
            ? navstyles.notify_people
            : ""
        } `}
      >
        <div
          onClick={() => {
            setSectionOpened({
              mylist: false,
              notification: !sectionOpened.notification,
              people: false,
            });
          }}
        >
          <ion-icon
            data-count={notifications.filter((n) => n.unRead === true).length}
            name="notifications-outline"
          ></ion-icon>
        </div>
        {sectionOpened.notification && !isMobile && <Notification />}
      </div>
      {sectionOpened.notification && isMobile && (
        <div className={styles.mobile_close_sec}>
          <Notification />
          <div className={styles.close_section} onClick={closeAll}></div>
        </div>
      )}
    </>
  );
};

export const PeopleIcon = ({
  sectionOpened,
  setSectionOpened,
  isMobile,
  closeAll,
}) => {
  // const uid = useSelector((state) => state.userAuth.user.uid);
  const receivedRequests = useSelector(
    (state) => state.people.receivedRequests
  );
  const friends = useSelector((state) => state.people.friends);

  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("updated-online-users", (res) => {
      const onlineUsers = res.users?.map((i) => {
        return i["userId"];
      });
      // console.log("online:", onlineUsers);
      dispatch(setOnlineUsers(onlineUsers));
    });
    socket.on("receive-friend-request", ({ request }) => {
      console.log(receivedRequests);
      const a = [...receivedRequests, { ...request }];
      console.log(a, "----");

      console.log("received-FR", request.uid, " - ", a.length);
      dispatch(setReceivedRequest(a));
    });

    socket.on("remove-received-request", (res) => {
      const a = receivedRequests.filter((req) => req.uid !== res.senderId);
      console.log("removed-FR", res.senderId, " - ", a.length);
      dispatch(setReceivedRequest(a));
    });

    socket.on("request-accepted", (res) => {
      // console.log("r-acpt", res);
      console.log("r-acpt", res.senderId);
      dispatch(
        setFriends([
          ...friends,
          {
            uid: res.senderId,
            added: new Date().toLocaleString(),
            _id: res.receiverId,
          },
        ])
      );
    });

    socket.on("friend-removed", (res) => {
      const f = friends.filter((i) => i.uid !== res.senderId);
      console.log("remove f:", f);
      dispatch(setFriends(f));
    });
  }, [socket]);
  // .filter((i) => !i.seen)
  return (
    <>
      <div
        className={`${navstyles.secondary_icon}  ${
          sectionOpened.people ? styles.active : ""
        } ${receivedRequests.length > 0 ? navstyles.notify_people : ""}`}
      >
        <div
          onClick={() => {
            setSectionOpened({
              mylist: false,
              notification: false,
              people: !sectionOpened.people,
            });
          }}
        >
          <ion-icon
            data-count={receivedRequests.length}
            name="people-outline"
          ></ion-icon>
        </div>
        {sectionOpened.people && !isMobile && <People />}
      </div>

      {sectionOpened.people && isMobile && (
        <div className={styles.mobile_close_sec}>
          <People />
          <div className={styles.close_section} onClick={closeAll}></div>
        </div>
      )}
    </>
  );
};

// const allNotifs = [
//   {
//     id: "079igifiw4",
//     type: "movie-suggestion",
//     unRead: true,
//     sender: "Rolf Crawford",
//     movieId: "tt2250912",
//     title: "Spider-Man: Homecoming",
//     year: "2017",
//     timeStamp: new Date().setTime(new Date().getTime() - 2 * 1000),
//   },
//   {
//     id: "079ithfiw4",
//     type: "movie-suggestion",
//     unRead: true,
//     sender: "Rolf Crawford",
//     movieId: "tt7286456",
//     title: "Joker",
//     year: "2019",
//     timeStamp: new Date().setDate(new Date().getDate() - 5),
//   },

//   {
//     id: "0",
//     type: "request-accepted",
//     unRead: true,
//     sender: "jaswanth8ew78we8hgwe8f",
//     timeStamp: new Date().setTime(new Date().getTime() - 45 * 1000),
//   },
//   {
//     id: "123",
//     type: "request-accepted",
//     unRead: true,
//     sender: "jaswanth g8ew78we8hgwe8f",
//     timeStamp: new Date().setTime(new Date().getTime() - 5 * 1000),
//   },
//   {
//     id: "12ew2",
//     type: "request-accepted",
//     unRead: false,
//     sender: "jas e8f",
//     timeStamp: new Date().setTime(new Date().getTime() - 15 * 60 * 1000),
//   },
//   {
//     id: "1",
//     type: "request-accepted",
//     unRead: false,
//     sender: "jaswanth",
//     timeStamp: new Date().setTime(new Date().getTime() - 30 * 60 * 1000),
//   },
//   {
//     id: "2",
//     type: "request-accepted",
//     unRead: true,
//     sender: "jaswanth",
//     timeStamp: "Fri May 20 2022 4:06:43 GMT+0530",
//   },
//   {
//     id: "3",
//     type: "request-accepted",
//     unRead: true,
//     sender: "jaswanth",
//     timeStamp: "Wed May 04 2022 09:36:35 GMT+0530",
//   },
//   {
//     id: "4",
//     type: "request-accepted",
//     unRead: false,
//     sender: "Olivia Jensen",
//     timeStamp: "Sun May 15 2022 15:59:30 GMT+0530",
//   },
//   {
//     id: "5",
//     type: "request-accepted",
//     unRead: false,
//     sender: "Bianca Jordan",
//     timeStamp: "Thu May 05 2022 00:50:57 GMT+0530",
//   },
//   {
//     id: "6",
//     type: "request-accepted",
//     unRead: true,
//     sender: "Jamie Silva",
//     timeStamp: "Sat May 07 2022 15:10:02 GMT+0530",
//   },
//   {
//     id: "7",
//     type: "request-accepted",
//     unRead: false,
//     sender: "Jamie Silva",
//     timeStamp: "Thu May 05 2022 05:18:14 GMT+0530",
//   },
//   {
//     id: "8",
//     type: "request-accepted",
//     unRead: false,
//     sender: "Jamie Silva",
//     timeStamp: "Wed May 11 2022 02:26:16 GMT+0530",
//   },
//   {
//     id: "9",
//     type: "request-accepted",
//     unRead: false,
//     sender: "jaswanth",
//     timeStamp: "Mon May 16 2022 16:56:25 GMT+0530",
//   },
// ];
