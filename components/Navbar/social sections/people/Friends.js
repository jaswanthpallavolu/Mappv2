import React, { useEffect, useState } from "react";
import { CurrentUser , Friend, User} from "./User";
import styles from "./friends.module.css";
import axios from "axios";
import { useSelector } from "react-redux";
import { socket } from "../../../Layout";

export default function Friends(props) {
  const {search, requser, setRequser} = props.dataprops
  const uid = useSelector((state) => state.userAuth.user.uid)

  const [searchList, setSearchList] = useState([]);
  // online
  const [online, setOnline] = useState([]);
  const [dis_online, setDis_online] = useState(true);
  const [dis_on_list, setDis_on_list] = useState(5);

  // friends
  const [dis_friends, setDis_friends] = useState(true);
  const [dis_off_list, setDis_off_list] = useState(5);

  const [friends_list,setFriends_list] = useState([])

  const dis_on_listHandle = () => {
    setDis_online(!dis_online);
    setDis_on_list(dis_online ? online.length : 5);
  };

  const dis_off_listHandle = () => {
    setDis_friends(!dis_friends);
    setDis_off_list(dis_friends ? friends_list.length : 5);
  };

  const online_list = online.slice(0, dis_on_list);
  // const friends_list = friends.slice(0, dis_off_list);

  const searchusers = async(word,uid)=>{
    const users = await axios.get(`http://localhost:4500/friends/search?word=${word}&uid=${uid}`)
    setSearchList(users.data)
  }

  const fecthFriends = async(uid)=>{
    const details = await axios.get(`http://localhost:4500/friends/details?uid=${uid}`)
    return details.data.friends
  }

  const friendsStatus = async(online_users)=>{
    const friends = await fecthFriends(uid)
    const online_friends = friends?.filter(i=>online_users.includes(i)===true)
    setOnline(online_friends)

    const offline_friends = friends?.filter(i=>online_users.includes(i)===false)
    setFriends_list(offline_friends)
  }

  useEffect(()=>{
    socket.on("updated-online-users",(res)=>{
      const online_users = res.users?.map(i=>{
          return i["userId"]
      })
      friendsStatus(online_users)
    })

  },[socket])

  useEffect(() => {
    // if (search !== "") {
    //   const newList = userList.filter((item) => {
    //     return item.username
    //       .toLowerCase()
    //       .includes(search.toLowerCase());
    //   });

      // setSearchList(newList);
    // }
    if(search.length > 0){
      searchusers(search.toLowerCase(),uid)
    }
    else if(search.length === 0){
      socket.emit("get-online-users", uid)
    }
  }, [uid,search]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {(search.length === 0 && uid) && (
        <div className={styles.list}>
          <div className={styles.online}>
            <p>Online [{online.length+1}]</p>
            <CurrentUser uid={uid} />
            {online?.map((item, index) =>
                <Friend uid={item} status={true} key={item}/>
            )}
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
                  <Friend uid={item} status={false} key={item}/>
              );
            })}
            {friends_list.length > 5 && (
              <button onClick={dis_off_listHandle} className={styles.see_btn}>
                {dis_online ? "see more >>" : "see less <<"}
              </button>
            )}
          </div>
        </div>
      )}
      {search.length > 0 &&
        searchList.map((item, index) => {
          return (
              <User uid={item["uid"]} key={item["uid"]} />
          );
        })}
    </>
  );
}
