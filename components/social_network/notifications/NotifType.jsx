import React, { useEffect, useState } from "react";
import notifStyles from "./notif.module.css";
import {
  updateNotification,
  markAsRead,
} from "../../../redux/features/notificationSlice";
import { getUserDetails } from "../../../redux/features/peopleSlice";
import { useDispatch } from "react-redux";
import { ProfilePic } from "../people/user/Profile";
import Skeleton from "../../../utils/skeleton/Skeleton";

const ellipsisFormat = (name) => {
  if (!name) return;
  return name.length > 20 ? name.slice(0, 20) + "..." : name;
};

//notifaction types
export const RequestAccepted = ({ info, router }) => {
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const updateMark = () => {
    dispatch(updateNotification({ ...info, unRead: false }));
    //backend put request
    dispatch(markAsRead({ uid: info.receiverId, notifId: info._id }));
  };
  useEffect(() => {
    setLoading(true);
    dispatch(getUserDetails(info.senderId)).then((obj) => {
      setUserInfo(obj.payload);
      setLoading(false);
    });
  }, []);
  return (
    <div
      onMouseEnter={() => info.unRead && updateMark()}
      className={`${notifStyles.notification} ${
        !loading && info.unRead ? notifStyles.notify : ""
      }`}
    >
      {!loading && userInfo?.username ? (
        <>
          <ProfilePic url={userInfo.photoUrl} name={userInfo.username} />
          <div className={notifStyles.details}>
            <div className={notifStyles.msg}>
              <p>
                <b title={userInfo.username}>
                  {ellipsisFormat(userInfo.username)}
                </b>{" "}
                <small>{"accepted your friend request"}</small>
              </p>
            </div>
            <small>{info.timeElapsed}</small>
          </div>
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};

export const MovieSuggestion = ({ info, router }) => {
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const updateMark = () => {
    dispatch(updateNotification({ ...info, unRead: false }));
    dispatch(markAsRead({ uid: info.receiverId, notifId: info._id }));
  };
  const moviepath = `/movies/${info.movieId}?movie=${info.title.replaceAll(
    " ",
    "-"
  )}&year=${info.year}`;
  useEffect(() => {
    setLoading(true);
    dispatch(getUserDetails(info.senderId)).then((obj) => {
      setUserInfo(obj.payload);
      setLoading(false);
    });
  }, []);
  return (
    <div
      onMouseEnter={() => info.unRead && updateMark()}
      className={`${notifStyles.notification} ${
        info.unRead ? notifStyles.notify : ""
      }`}
    >
      {!loading && userInfo?.username ? (
        <>
          <ProfilePic url={userInfo.photoUrl} name={userInfo.username} />
          <div className={notifStyles.details}>
            <div className={notifStyles.msg}>
              <p>
                <b title={userInfo.username}>
                  {ellipsisFormat(userInfo.username)}
                </b>{" "}
                <small>{"suggested a movie"}</small>{" "}
                <b title={info.title} onClick={() => router.push(moviepath)}>
                  {ellipsisFormat(info.title)}
                </b>
              </p>
            </div>
            <small>{info.timeElapsed}</small>
          </div>
        </>
      ) : (
        <Skeleton />
      )}
    </div>
  );
};
