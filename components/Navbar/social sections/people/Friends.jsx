import React, { useEffect, useState } from "react";
import { CurrentUser, Friend, FriendRequest, User } from "./user/User";
import styles from "./friends.module.css";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../Layout";
import {
  searchUsers,
  setFriends,
} from "../../../../redux/features/peopleSlice";
import { Loader1 } from "../../../../utils/loaders/Loading";
export default function Friends(props) {
  const { search } = props.dataprops;
  const uid = useSelector((state) => state.userAuth.user.uid);
  const allUsers = useSelector((state) => state.people.allUsers);
  const onlineUsers = useSelector((state) => state.people.onlineUsers);
  // const pStatus = useSelector((state) => state.people.status);
  const friends = useSelector((state) => state.people.friends);

  const dispatch = useDispatch();

  const [searchList, setSearchList] = useState();
  // const [onlineusers, setOnlineUsers] = useState([]);
  // online
  const [online, setOnline] = useState([]);
  const [dis_online, setDis_online] = useState(true);
  const [dis_on_list, setDis_on_list] = useState(5);

  // friends
  const [dis_friends, setDis_friends] = useState(true);
  const [dis_off_list, setDis_off_list] = useState(5);

  const [friends_list, setFriends_list] = useState([]);

  const dis_on_listHandle = () => {
    setDis_online(!dis_online);
    setDis_on_list(dis_online ? online.length : 5);
  };

  const dis_off_listHandle = () => {
    setDis_friends(!dis_friends);
    setDis_off_list(dis_friends ? friends_list.length : 5);
  };

  // const online_list = online.slice(0, dis_on_list);
  // const friends_list = friends.slice(0, dis_off_list);

  const friendsStatus = () => {
    // console.log("status-func");
    const all_friends = friends?.map((i) => {
      return i["uid"];
    });

    const online_friends = all_friends?.filter(
      (i) => onlineUsers.includes(i) === true
    );
    online_friends = allUsers?.filter((i) => online_friends.includes(i.uid));
    setOnline(online_friends);

    const offline_friends = all_friends?.filter(
      (i) => onlineUsers.includes(i) === false
    );
    offline_friends = allUsers?.filter((i) => offline_friends.includes(i.uid));
    setFriends_list(offline_friends);
  };

  useEffect(() => {
    friendsStatus();
  }, [onlineUsers, friends]);

  const searchusers = async (signal) => {
    dispatch(searchUsers({ name: search.toLowerCase(), uid, signal })).then(
      (res) => setSearchList(res.payload)
    );
  };
  useEffect(() => {
    var timer;
    const controller = new AbortController();
    if (search.length > 0) {
      timer = setTimeout(() => searchusers(controller.signal), 350);
    }
    // else if (search.length === 0) {
    //   socket.emit("get-online-users", uid);
    // }
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search, friends]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // socket.emit("get-online-users", uid);
  }, []);
  return (
    <>
      {search.length === 0 && (
        <div className={styles.friends}>
          <div className={styles.online}>
            <p>Online [{online.length + 1}]</p>
            <CurrentUser
              userDetails={allUsers?.filter((i) => i.uid === uid)[0]}
            />
            {online?.map((item) => (
              <Friend userDetails={item} status={true} key={item.uid} />
            ))}
            {online.length > 5 && (
              <button onClick={dis_on_listHandle} className={styles.see_btn}>
                {dis_online ? "see more >>" : "<< see less"}
              </button>
            )}
          </div>
          <div className={styles.offline}>
            <p>Friends [{friends_list.length}]</p>
            {friends_list?.map((item, index) => {
              return (
                <Friend userDetails={item} status={false} key={item.uid} />
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
      {search.length > 0 && searchList && (
        <SearchResult
          searchList={searchList}
          onlineFriends={online}
          offlineFriends={friends_list}
        />
      )}

      {/* {pStatus === "loading" && (
        <div className={styles.loaderSection}>
          <Loader1 />
        </div>
      )} */}
    </>
  );
}

export function SearchResult({ searchList, onlineFriends, offlineFriends }) {
  const [onlineSearchFriends, setOnlineSearchFriends] = useState([]);
  const [offlineSearchFriends, setOfflineSearchFriends] = useState([]);

  const friendsStatus = () => {
    setOnlineSearchFriends(
      searchList?.friends.filter((i) =>
        onlineFriends
          ?.map((j) => {
            return j.uid;
          })
          .includes(i.uid)
      )
    );
    setOfflineSearchFriends(
      searchList?.friends.filter((i) =>
        offlineFriends
          ?.map((j) => {
            return j.uid;
          })
          .includes(i.uid)
      )
    );
  };
  const toggleCondition =
    searchList.friends?.length ||
    searchList.sendRequests?.length ||
    searchList.receivedRequests?.length ||
    searchList.normal?.length;
  useEffect(() => {
    friendsStatus();
  }, [searchList, onlineFriends, offlineFriends]);

  return (
    <>
      {toggleCondition ? (
        <div className={styles.searchList}>
          {onlineSearchFriends?.map((item, index) => {
            return (
              <Friend userDetails={item} status={true} key={item["uid"]} />
            );
          })}
          {offlineSearchFriends?.map((item, index) => {
            return (
              <Friend userDetails={item} status={false} key={item["uid"]} />
            );
          })}
          {searchList?.receivedRequests.map((item, index) => {
            return <FriendRequest userDetails={item} key={item.uid} />;
          })}
          {searchList?.sendRequests.map((item, index) => {
            return <User userDetails={item} type={"send"} key={item.uid} />;
          })}
          {searchList?.normal.map((item, index) => {
            return <User userDetails={item} type={"normal"} key={item.uid} />;
          })}
        </div>
      ) : (
        <div className={styles.noResult}>
          <h4>no result</h4>
        </div>
      )}
    </>
  );
}
