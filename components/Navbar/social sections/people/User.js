import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import { socket } from "../../../Layout";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setReceivedRequest } from "../../../../redux/features/peopleSlice";

const fecthUserDetails = async(uid)=>{
  const details = await axios.get(
    `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/friends/details?uid=${uid}`
  )
  return details.data
}

export function User({ uid }) {
  const [userDetails,setUserDetails] = useState()
  const myuid = useSelector((state)=> state.userAuth.user.uid)

  const fecthNormalUserdetails = async() =>{
    const data = await fecthUserDetails(uid)
    setUserDetails(data)
  }

  const addUserRequest = (receiverId) =>{
    setRequser(requser=>[...requser,receiverId])
  }

  const removeUserRequest = (receiverId) =>{
    setRequser(requser?.filter(i=>i!==receiverId))
  }

  const addUserFriend = (receiverId) =>{
    setFriends_list(friends_list=>[...friends_list,receiverId])
  }

  const removeUserFriend = (receiverId) =>{
    setFriends_list(friends_list?.filter(i=>i!==receiverId))
  }

  const userAction = async (action) => {
    if (action === "add") {
      socket.emit("send-friend-request",{senderId:myuid,receiverId:uid})
    }
  };

  //listeners
  // useEffect(() => {

  //   socket.on("receive-friend-request",(res)=>{
  //     setRelation(-2)
  //     addUserRequest(res.senderId)
  //     console.log("request came from ",res.senderId)
  //   })

  //   socket.on("notify-request-accepted",(res)=>{
  //     setRelation(1)
  //     addUserFriend(res.senderId)
  //     console.log("accept came from ",res.sender)
  //   })

  //   socket.on("notify-request-declined",(res)=>{
  //     setRelation(0)
  //     removeUserRequest(res.senderId)
  //     console.log("declined from ",res.sender)
  //   })

  //   socket.on("notify-friend-remove",(res)=>{
  //     setRelation(0)
  //     removeUserFriend(res.senderId)
  //     console.log("removed from ",res.sender)
  //   })

  // }, [socket]);

  useEffect(()=>{
    fecthNormalUserdetails()
  },[uid])

  return (
    <div className={styles.one}>
      {userDetails ? (
        <div className={styles.user_container}>
          <div
            className={`${styles.pic} ${styles.indi}`}
          >
            {userDetails["photo"] ? <img src={userDetails["photo"]} className={styles.pic}/> : userDetails.username[0]}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
          </div>
          <div className={styles.extend}>
            <div className={styles.cursor}>
              <i
                className="fa-solid fa-user-plus"
                title="Add Friend"
                onClick={() => userAction("add")}
              ></i>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

export function CurrentUser({ userDetails }){
  return(
      <div className={styles.user_container}>
        {userDetails && (
        <>
          <div
            className={`${styles.pic} ${styles.indi} ${
              styles.green
            }`}
          >
            {userDetails["photoUrl"] ? <img src={userDetails["photoUrl"]} className={styles.pic}/> : userDetails.username[0]}
          </div>
          <div className={styles.info}>
            <div className={styles.name}>{userDetails.username}</div>
            <div className={styles.status}>
              {"Online"}
            </div>
          </div>
          <div className={styles.you}>
            <p>you</p>
          </div>
        </>)}
      </div>
  )
}

export function Friend({ userDetails, status }){
  const uid = useSelector((state)=> state.userAuth.user.uid)
  const friends = useSelector((state)=> state.people.friends)
  const dispatch = useDispatch()

  const removeFriend = ()=>{
    socket.emit("friend-remove",{senderId:uid,receiverId:userDetails.uid})
    dispatch(setFriends(friends.filter(i=>i.uid!==userDetails.uid)))
  }

  return(
    <div className={styles.one}>
    {userDetails && (
      <div className={styles.user_container}>
        <div
          className={`${styles.pic} ${styles.indi} ${
            (status) ? styles.green : styles.grey
          }`}
        >
          {userDetails["photoUrl"] ? <img src={userDetails["photoUrl"]} className={styles.pic}/> : userDetails.username[0]}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{userDetails.username}</div>
          <div className={styles.status}>
            {status ? "Online" : "Offline"}
          </div>
        </div>
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
     </div>)}
    </div>
  )
}

export function FriendRequest({ userDetails, receive }){
  const uid = useSelector((state)=> state.userAuth.user.uid)
  const friends = useSelector((state)=> state.people.friends)
  const receivedRequests = useSelector((state)=> state.people.receivedRequests)

  const dispatch = useDispatch()

  const acceptRequest = ()=>{
    socket.emit("friend-request-accepted",{senderId:uid,receiverId:userDetails.uid})
    dispatch(setReceivedRequest(receivedRequests.filter(i=>i.uid!==userDetails.uid)))

    dispatch(setFriends([...friends,{uid:userDetails.uid,added:new Date().toLocaleString(),_id:userDetails.uid}]))
  }

  const decineRequest = ()=>{
    socket.emit("friend-request-declined",{senderId:uid,receiverId:userDetails.uid})
    dispatch(setReceivedRequest(receivedRequests.filter(i=>i.uid!==userDetails.uid)))
  }

  return(
    <div className={styles.request}>
      {userDetails && (
        <>
          <div className={styles.name}>{userDetails.username}</div>
          <div className={styles.options}>
            {receive && <button onClick={acceptRequest}>Accept</button>}
            <button onClick={decineRequest}>decline</button>
          </div>
        </>
      )}
    </div>
  )
}
