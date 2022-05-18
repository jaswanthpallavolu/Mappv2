import React, { useEffect, useState } from "react";
import navstyles from "../Navbar.module.css";
import styles from "./iconsection.module.css";
import People from "./people/People";
import Notification from "./notifications/Notification";
import MyList from "./mylist/MyList";

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
  // useEffect(() => {
  //   if (
  //     sectionOpened.mylist ||
  //     sectionOpened.notification ||
  //     sectionOpened.people
  //   ) {
  //     document.body.style.height = "100vw";
  //   } else document.body.style.position = "";
  // }, [sectionOpened]);
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
        className={`${navstyles.secondary_icon} ${navstyles.notify} ${
          styles.icon
        } ${sectionOpened.mylist ? styles.active : ""} ${
          isMobile ? navstyles.mobnav_nicon : ""
        } ${navstyles.disable}`}
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
  return (
    <>
      <div
        className={`${navstyles.secondary_icon}  ${
          sectionOpened.notification ? styles.active : ""
        } ${navstyles.notify} `}
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
          <ion-icon name="notifications-outline"></ion-icon>
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
  return (
    <>
      <div
        className={`${navstyles.secondary_icon}  ${
          sectionOpened.people ? styles.active : ""
        } ${navstyles.notify}`}
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
          <ion-icon name="people-outline"></ion-icon>
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
