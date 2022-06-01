import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import socket from "../../../../socket.connect";
import { useDispatch, useSelector } from "react-redux";
import {
  addFriend,
  addSentRequest,
  removeFriend,
  removeReceivedRequest,
  removeSentRequest,
} from "../../../../redux/features/peopleSlice";

import { ProfilePic } from "./Profile";

export function CurrentUser({ userDetails }) {
  return (
    <div className={styles.user_container}>
      {userDetails && (
        <div className={styles.main_details}>
          <div className={`${styles.pic} ${styles.indi} ${styles.green}`}>
            <ProfilePic
              url={userDetails.photoUrl}
              name={userDetails.username}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
            <div className={styles.status}>{"Online"}</div>
          </div>
        </div>
      )}
      <div className={styles.you}>
        <p>you</p>
      </div>
    </div>
  );
}

// both User AND sendRequest SHOULD BE combined into one component
export function User({ userDetails, type }) {
  const uid = useSelector((state) => state.userAuth.user.uid);

  const [toggleRequestIcon, setToggleRequestIcon] = useState(type);

  const dispatch = useDispatch();

  const userAction = (action) => {
    if (action === "add") {
      socket.emit("send-friend-request", {
        senderId: uid,
        receiverId: userDetails.uid,
      });
      dispatch(
        addSentRequest({
          uid: userDetails.uid,
          sentRequest: true,
          time: new Date().toLocaleString(),
          seen: false,
          _id: userDetails.uid,
        })
      );
      setToggleRequestIcon("send");
    }
    if (action === "cancel") {
      socket.emit("decline-friend-request", {
        senderId: uid,
        receiverId: userDetails.uid,
      });
      dispatch(removeSentRequest({ senderId: userDetails.uid }));
      setToggleRequestIcon("normal");
    }
  };

  useEffect(() => {
    socket.on("remove-received-request", (res) => {
      dispatch(removeSentRequest({ senderId: res.senderId }));
    });
  }, [socket]);

  return (
    <div className={styles.user_container}>
      {userDetails && (
        <div className={styles.main_details}>
          <div className={`${styles.pic} ${styles.indi}`}>
            <ProfilePic
              url={userDetails.photoUrl}
              name={userDetails.username}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
          </div>
        </div>
      )}
      <div className={styles.extend}>
        <div className={styles.cursor}>
          {toggleRequestIcon === "normal" && (
            <i
              className="fa-solid fa-user-plus"
              title="Add Friend"
              onClick={() => userAction("add")}
            ></i>
          )}
          {toggleRequestIcon === "send" && (
            <i
              className="fa-solid fa-user-xmark"
              title="Remove Request"
              onClick={() => userAction("cancel")}
            ></i>
          )}
        </div>
      </div>
    </div>
  );
}

export function Friend({ userDetails, status }) {
  const uid = useSelector((state) => state.userAuth.user.uid);
  const dispatch = useDispatch();

  const unFriend = () => {
    socket.emit("remove-friend", {
      senderId: uid,
      receiverId: userDetails.uid,
    });
    dispatch(removeFriend({ uid: userDetails.uid }));
  };

  return (
    <div className={styles.user_container}>
      {userDetails && (
        <div className={styles.main_details}>
          <div
            className={`${styles.pic} ${styles.indi} ${
              status ? styles.green : styles.grey
            }`}
          >
            <ProfilePic
              url={userDetails.photoUrl}
              name={userDetails.username}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
            <div className={styles.status}>{status ? "Online" : "Offline"}</div>
          </div>
        </div>
      )}
      <div className={styles.extend}>
        <div className={styles.disable}>
          <i
            className="fa-solid fa-message"
            title="Message"
            style={{ opacity: 0.7 }}
          ></i>
        </div>
        <div className={styles.cursor}>
          <i
            className="fa-solid fa-user-minus"
            title="Remove Friend"
            onClick={unFriend}
          ></i>
        </div>
      </div>
    </div>
  );
}

export function FriendRequest({ userDetails }) {
  const uid = useSelector((state) => state.userAuth.user.uid);

  const dispatch = useDispatch();

  const acceptRequest = () => {
    socket.emit("accept-friend-request", {
      senderId: uid,
      receiverId: userDetails.uid,
    });
    dispatch(removeReceivedRequest({ senderId: userDetails.uid }));

    dispatch(
      addFriend({
        uid: userDetails.uid,
        added: new Date().toLocaleString(),
        _id: userDetails.uid,
      })
    );
  };

  const decineRequest = () => {
    socket.emit("decline-friend-request", {
      senderId: uid,
      receiverId: userDetails.uid,
    });
    dispatch(removeReceivedRequest({ senderId: userDetails.uid }));
  };

  return (
    <div className={`${styles.user_container} ${styles.request}`}>
      {userDetails && (
        <div className={styles.main_details}>
          <div className={styles.profile}>
            <ProfilePic
              url={userDetails.photoUrl}
              name={userDetails.username}
            />
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
          </div>
        </div>
      )}
      <div className={styles.options}>
        <button onClick={acceptRequest} className={styles.accept}>
          Accept
        </button>
        <button onClick={decineRequest} className={styles.decline}>
          Decline
        </button>
      </div>
    </div>
  );
}
