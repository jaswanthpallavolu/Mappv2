import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import { socket } from "../../../../Layout";
import { useDispatch, useSelector } from "react-redux";
import {
  setFriends,
  setReceivedRequest,
  setSentRequest,
} from "../../../../../redux/features/peopleSlice";

export function CurrentUser({ userDetails }) {
  return (
    <div className={styles.user_container}>
      {userDetails && (
        <div className={styles.main_details}>
          <div className={`${styles.pic} ${styles.indi} ${styles.green}`}>
            {userDetails["photoUrl"] ? (
              <img
                src={userDetails["photoUrl"]}
                className={styles.pic}
                alt={userDetails.username[0]}
              />
            ) : (
              userDetails.username[0]
            )}
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
  const sentRequests = useSelector((state) => state.people.sentRequests);

  const [typel,setType] = useState(type)

  const dispatch = useDispatch()

  const userAction = (action) => {
    if (action === "add") {
      socket.emit("send-friend-request",{senderId:uid,receiverId:userDetails.uid})
      dispatch(setSentRequest([...sentRequests,{uid:userDetails.uid,sentRequest:true,time: new Date().toLocaleString(),seen: false,_id:userDetails.uid},]))
    }
    if(action==="cancel") {
      socket.emit("friend-request-declined",{senderId:uid,receiverId:userDetails.uid})
      dispatch(setSentRequest(sentRequests.filter(i=>i.uid!==userDetails.uid)))
    }
  };

  useEffect(()=>{
    socket.on("request-declined",(res)=>{
      setType("normal")
    })
  },[socket])

  return (
    <div className={styles.user_container}>
      {userDetails && (
        <div className={styles.main_details}>
          <div className={`${styles.pic} ${styles.indi}`}>
            {userDetails["photoUrl"] ? (
              <img
                src={userDetails["photoUrl"]}
                className={styles.pic}
                alt={userDetails.username[0]}
              />
            ) : (
              userDetails.username[0]
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
          </div>
        </div>
      )}
      <div className={styles.extend}>
        <div className={styles.cursor}>
          {typel==="normal" &&
            <i
              className="fa-solid fa-user-plus"
              title="Add Friend"
              onClick={() => userAction("add")}
            ></i>}
          {typel==="send" &&
            <i
            className="fa-solid fa-user-xmark"
            title="Remove Request"
            onClick={() => userAction("cancel")}
          ></i>}
        </div>
      </div>
    </div>
  );
}

export function Friend({ userDetails, status }) {
  const uid = useSelector((state) => state.userAuth.user.uid);
  const friends = useSelector((state) => state.people.friends);
  const dispatch = useDispatch();

  const removeFriend = () => {
    socket.emit("friend-remove", {
      senderId: uid,
      receiverId: userDetails.uid,
    });
    dispatch(setFriends(friends.filter((i) => i.uid !== userDetails.uid)));
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
            {userDetails["photoUrl"] ? (
              <img src={userDetails["photoUrl"]} className={styles.pic} />
            ) : (
              userDetails.username[0]
            )}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
            <div className={styles.status}>{status ? "Online" : "Offline"}</div>
          </div>
        </div>
      )}
      <div className={styles.extend}>
        <div className={styles.cursor}>
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
            onClick={removeFriend}
          ></i>
        </div>
      </div>
    </div>
  );
}

export function FriendRequest({ userDetails }) {
  const uid = useSelector((state) => state.userAuth.user.uid);
  const friends = useSelector((state) => state.people.friends);
  const receivedRequests = useSelector(
    (state) => state.people.receivedRequests
  );

  const dispatch = useDispatch();

  const acceptRequest = () => {
    socket.emit("friend-request-accepted", {
      senderId: uid,
      receiverId: userDetails.uid,
    });
    dispatch(
      setReceivedRequest(
        receivedRequests.filter((i) => i.uid !== userDetails.uid)
      )
    );

    dispatch(
      setFriends([
        ...friends,
        {
          uid: userDetails.uid,
          added: new Date().toLocaleString(),
          _id: userDetails.uid,
        },
      ])
    );
  };

  const decineRequest = () => {
    socket.emit("friend-request-declined", {
      senderId: uid,
      receiverId: userDetails.uid,
    });
    dispatch(
      setReceivedRequest(
        receivedRequests.filter((i) => i.uid !== userDetails.uid)
      )
    );
  };

  return (
    <div className={styles.request}>
      {userDetails && (
        <>
          <div className={styles.name}>{userDetails.username}</div>
          <div className={styles.options}>
            <button onClick={acceptRequest}>Accept</button>
            <button onClick={decineRequest}>Decline</button>
          </div>
        </>
      )}
    </div>
  );
}
