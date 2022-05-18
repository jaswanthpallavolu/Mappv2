import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./user.module.css";
import { socket } from "../../../Layout";

function User({ uid }) {
  const [user, setUser] = useState();
  const [relation, setRelation] = useState(0);
  const myuid = useSelector((state) => state.userAuth.user.uid);

  const fecthdetails = async () => {
    const details = await axios.get(
      `http://localhost:4500/friends/details?uid=${uid}`
    );
    if (details.data.friends.includes(myuid)) {
      // tick
      setRelation(1);
    } else if (details.data.send_requests.includes(myuid)) {
      // me accept
      setRelation(-2);
    } else if (details.data.receive_requests.includes(myuid)) {
      // decline
      setRelation(-1);
    }
    setUser(details.data);
  };

  const userAction = async (action) => {
    if (action === "add") {
      await axios.put(
        `http://localhost:4500/friends/sendRequest?from=${myuid}&to=${uid}`
      );
      setRelation(-1);
    } else if (action === "accept") {
      await axios.put(
        `http://localhost:4500/friends/acceptRequest?from=${myuid}&to=${uid}`
      );
      setRelation(1);
    } else if (action === "decline") {
      await axios.put(
        `http://localhost:4500/friends/declineRequest?from=${myuid}&to=${uid}`
      );
      setRelation(0);
    } else if (action === "remove") {
      await axios.put(
        `http://localhost:4500/friends/remove?from=${myuid}&to=${uid}`
      );
      setRelation(0);
    }
  };

  //listeners
  useEffect(() => {
    socket.on("receive-friend-request", (res) => {
      console.log(res);
    });
  }, [socket]);

  useEffect(() => {
    fecthdetails();
    socket.emit("get-online-users", uid);
  }, [uid]);

  return (
    <div className={styles.one}>
      {user ? (
        <div className={styles.user_container}>
          <div
            className={`${styles.pic} ${styles.indi} ${
              user.status ? styles.green : styles.grey
            }`}
          >
            {user.username[0]}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{user.username}</div>
            <div className={styles.status}>
              {user.status ? "Online" : "Offline"}
            </div>
          </div>
          {uid !== myuid ? (
            <div className={styles.extend}>
              <div className={styles.cursor}>
                <i
                  className="fa-solid fa-message"
                  title="Message"
                  style={{ opacity: 0.7 }}
                ></i>
              </div>
              <div className={styles.cursor}>
                {relation === 0 ? (
                  <i
                    className="fa-solid fa-user-plus"
                    title="Add Friend"
                    onClick={() => userAction("add")}
                  ></i>
                ) : (
                  ""
                )}
                {relation === 1 ? (
                  <i
                    className="fa-solid fa-user-minus"
                    title="Friend"
                    onClick={() => userAction("remove")}
                  ></i>
                ) : (
                  ""
                )}
                {relation === -1 ? (
                  <i
                    className="fa-solid fa-user-xmark"
                    title="Cancel Request"
                    onClick={() => userAction("decline")}
                  ></i>
                ) : (
                  ""
                )}
                {relation === -2 ? (
                  <i
                    className="fa-solid fa-user-clock"
                    title="Accept Request"
                    onClick={() => userAction("accept")}
                  ></i>
                ) : (
                  ""
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export default User;
