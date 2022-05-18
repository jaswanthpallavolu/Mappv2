import React, { useEffect, useState } from "react";
import User from "./User";
import styles from "./friends.module.css";
import { userList } from "./ListDrop";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Friends(props) {
  const uid = useSelector((state) => state.userAuth.user.uid)

  const [searchList, setSearchList] = useState([]);
  // online
  const [online, setOnline] = useState([]);
  const [dis_online, setDis_online] = useState(true);
  const [dis_on_list, setDis_on_list] = useState(5);

  // friends
  const [friends, setFriends] = useState([]);
  const [dis_friends, setDis_friends] = useState(true);
  const [dis_off_list, setDis_off_list] = useState(5);

  const [friends_list,setFriends_list] = useState([])

  const current_user = {
    username: "ceaser",
    status: "online",
  };

  const onlineHandle = (d) => setOnline((old) => [...old, d]);
  const friendsHandle = (d) => setFriends((old) => [...old, d]);

  const dis_on_listHandle = () => {
    setDis_online(!dis_online);
    setDis_on_list(dis_online ? online.length : 5);
  };

  const dis_off_listHandle = () => {
    setDis_friends(!dis_friends);
    setDis_off_list(dis_friends ? friends.length : 5);
  };

  const online_list = online.slice(0, dis_on_list);
  // const friends_list = friends.slice(0, dis_off_list);

  useEffect(() => {
    for (let user of userList) {
      if (user.status === true) onlineHandle(user);
      else friendsHandle(user);
    }
  }, [userList]); //eslint-disable-line react-hooks/exhaustive-deps

  const searchusers = async(word,uid)=>{
    const users = await axios.get(`http://localhost:4500/friends/search?word=${word}&uid=${uid}`)
    setSearchList(users.data)
  }

  const fecthFriends = async(uid)=>{
    const details = await axios.get(`http://localhost:4500/friends/details?uid=${uid}`)
    setFriends_list(details.data.friends)
  }

  useEffect(() => {
    // if (props.searchTerm !== "") {
    //   const newList = userList.filter((item) => {
    //     return item.username
    //       .toLowerCase()
    //       .includes(props.searchTerm.toLowerCase());
    //   });

      // setSearchList(newList);
    // }
    if(props.searchTerm.length > 0){
      searchusers(props.searchTerm.toLowerCase(),uid)
    }
    else if(props.searchTerm.length === 0){
      fecthFriends(uid)
    }
  }, [uid,props.searchTerm]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {(props.searchTerm.length === 0 && uid) && (
        <div className={styles.list}>
          <div className={styles.online}>
            <p>Online [{online.length}]</p>
            <div className={styles.user_container}>
              <User
                uid={uid}
                className={`${styles.User} ${styles.current}`}
                my={true}
              />
              <div className={styles.you}>
                <p>you</p>
              </div>
            </div>
            {/* {online_list.map((item, index) => {
              return (
                <div key={index} className={styles.user_container}>
                  <User data={item} className={styles.User} />
                  <div className={styles.extend}>
                    <div className={styles.cursor}>
                      <ion-icon name="chatbox-outline"></ion-icon>
                    </div>
                    <div className={styles.cursor}>
                      <ion-icon name="person-remove-outline"></ion-icon>
                    </div>
                  </div>
                </div>
              );
            })} */}
            {online.length > 5 && (
              <button onClick={dis_on_listHandle} className={styles.see_btn}>
                {dis_online ? "see more >>" : "<< see less"}
              </button>
            )}
          </div>
          <div className={styles.friends}>
            <p>Friends [{friends_list.length}]</p>
            {friends_list.map((item, index) => {
              return (
                  <User uid={item} className={styles.User} />
              );
            })}
            {friends.length > 5 && (
              <button onClick={dis_off_listHandle} className={styles.see_btn}>
                {dis_online ? "see more >>" : "see less <<"}
              </button>
            )}
          </div>
        </div>
      )}
      {props.searchTerm.length > 0 &&
        searchList.map((item, index) => {
          return (
              <User uid={item["uid"]} className={styles.User} />
          );
        })}
    </>
  );
}
