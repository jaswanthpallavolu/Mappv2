import React, { useEffect, useState } from "react";
import navstyles from "../Navbar/Navbar.module.css";
import styles from "./iconsection.module.css";
import People from "./people/People";
import Notification from "./notifications/Notification";
import MyList from "../Home_categories/MyList";
import {
  fetchNotifications,
  addNotification,
  removeNotification,
} from "../../redux/features/notificationSlice";

import {
  setOnlineUsers,
  removeReceivedRequest,
  addReceivedRequest,
  removeSentRequest,
  addFriend,
  removeFriend,
  fetchFriends,
} from "../../redux/features/peopleSlice";
import { useRouter } from "next/router";
import socket from "../../socket.connect";
import { useDispatch, useSelector } from "react-redux";

export default function SecondaryIcons({ isMobile }) {
  const router = useRouter();
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

  useEffect(() => {
    closeAll();
  }, [router.pathname]);

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
        // onClick={() => {
        //   setSectionOpened({
        //     mylist: !sectionOpened.mylist,
        //     notification: false,
        //     people: false,
        //   });
        // }}
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

  const addNotif = ({ request }) => {
    if (request?._id) {
      // console.log("new-notif", request);
      dispatch(addNotification(request));
    }
  };
  const removeNotif = ({ request }) => {
    // console.log("deleted-notif", request);
    dispatch(removeNotification({ id: request._id }));

    // dispatch(setNotifications([...notifications, { ...res }]));
  };
  useEffect(() => {
    socket.on("receive-new-notification", addNotif);
    socket.on("remove-notification", removeNotif);

    return () => {
      socket.off("receive-new-notification", addNotif);
      socket.off("remove-notification", removeNotif);
    };
  }, [socket]); //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(fetchNotifications(uid));
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
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
        {sectionOpened.notification && !isMobile && (
          <Notification closeAll={closeAll} />
        )}
      </div>
      {sectionOpened.notification && isMobile && (
        <div className={styles.mobile_close_sec}>
          <Notification closeAll={closeAll} />
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
  const uid = useSelector((state) => state.userAuth.user.uid);
  const receivedRequests = useSelector(
    (state) => state.people.receivedRequests
  );

  const dispatch = useDispatch();

  const updateOnlineUsers = (res) => {
    const onlineUsers = res.users?.map((i) => {
      return i["userId"];
    });
    // console.log("online:", onlineUsers);
    dispatch(setOnlineUsers(onlineUsers));
  };
  const receiveFriendReq = ({ request }) => {
    // console.log(request);
    dispatch(addReceivedRequest(request));
  };
  const deleteReceivedReq = (res) => {
    dispatch(removeReceivedRequest(res));
    dispatch(removeSentRequest({ senderId: res.senderId }));
  };
  const reqAccept = (res) => {
    // console.log("r-acpt", res.senderId);
    dispatch(
      addFriend({
        uid: res.senderId,
        added: new Date().toLocaleString(),
        _id: res.receiverId,
      })
    );
  };
  const unFriend = (res) => {
    // console.log(res);
    dispatch(removeFriend({ uid: res.senderId }));
  };
  useEffect(() => {
    socket.on("updated-online-users", updateOnlineUsers);
    socket.on("receive-friend-request", receiveFriendReq);
    socket.on("remove-received-request", deleteReceivedReq);
    socket.on("request-accepted", reqAccept);
    socket.on("nolonger-friend", unFriend);

    return () => {
      socket.off("updated-online-users", updateOnlineUsers);
      socket.off("receive-friend-request", receiveFriendReq);
      socket.off("remove-received-request", deleteReceivedReq);
      socket.off("request-accepted", reqAccept);
      socket.off("nolonger-friend", unFriend);
    };
  }, [socket]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(fetchFriends(uid));
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div
        className={`${navstyles.secondary_icon}  ${
          sectionOpened.people ? styles.active : ""
        } ${
          !sectionOpened.people && receivedRequests.length > 0
            ? navstyles.notify_people
            : ""
        }`}
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
        {sectionOpened.people && !isMobile && <People closeAll={closeAll} />}
      </div>

      {sectionOpened.people && isMobile && (
        <div className={styles.mobile_close_sec}>
          <People closeAll={closeAll} />
          <div className={styles.close_section} onClick={closeAll}></div>
        </div>
      )}
    </>
  );
};

export const TitleHeader = ({ title, close }) => {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      <i onClick={close} className="fa-solid fa-xmark"></i>
    </div>
  );
};
