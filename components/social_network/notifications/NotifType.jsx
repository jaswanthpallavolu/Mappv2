import React, { useEffect, useState } from "react";
import notifStyles from "./notif.module.css";
import {
  updateNotification,
  markAsRead,
} from "../../../redux/features/notificationSlice";
import { getUserDetails } from "../../../redux/features/peopleSlice";
import { useDispatch } from "react-redux";
import { ProfilePic } from "../people/user/Profile";

const ellipsisFormat = (name) => {
  return name.length > 20 ? name.slice(0, 20) + "..." : name;
};

//notifaction types
export const RequestAccepted = ({ info, router }) => {
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();

  const updateMark = () => {
    dispatch(updateNotification({ ...info, unRead: false }));
    //backend put request
    dispatch(markAsRead({ uid: info.receiverId, notifId: info._id }));
  };
  useEffect(() => {
    dispatch(getUserDetails(info.senderId)).then((obj) =>
      setUserInfo(obj.payload)
    );
  }, []);
  return (
    <>
      {userInfo?.username && (
        <div
          onMouseEnter={() => info.unRead && updateMark()}
          className={`${notifStyles.notification} ${
            info.unRead ? notifStyles.notify : ""
          }`}
        >
          <ProfilePic url={userInfo.photoUrl} name={userInfo.username} />
          <div className={notifStyles.details}>
            <div className={notifStyles.msg}>
              <p>
                <b
                // onClik={()=> router.push(`/${info.sender}`)}
                >
                  {ellipsisFormat(userInfo.username)}
                </b>{" "}
                <small>{"accepted your friend request"}</small>
              </p>
            </div>
            <small>{info.timeElapsed}</small>
          </div>
        </div>
      )}
    </>
  );
};

export const MovieSuggestion = ({ info, router }) => {
  const [userInfo, setUserInfo] = useState({});
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
    dispatch(getUserDetails(info.senderId)).then((obj) =>
      setUserInfo(obj.payload)
    );
  }, []);
  return (
    <>
      {userInfo?.username && (
        <div
          onMouseEnter={() => info.unRead && updateMark()}
          className={`${notifStyles.notification} ${
            info.unRead ? notifStyles.notify : ""
          }`}
        >
          <ProfilePic url={userInfo.photoUrl} name={userInfo.username} />
          <div className={notifStyles.details}>
            <div className={notifStyles.msg}>
              <p>
                <b>{ellipsisFormat(userInfo.username)}</b>{" "}
                <small>{"suggested a movie"}</small>{" "}
                <b onClick={() => router.push(moviepath)}>
                  {ellipsisFormat(info.title)}
                </b>
              </p>
            </div>
            <small>{info.timeElapsed}</small>
          </div>
        </div>
      )}
    </>
  );
};
