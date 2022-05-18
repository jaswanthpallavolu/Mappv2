import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./user.module.css";

function User({uid,my}) {
  const [user,setUser] = useState()
  const [relation,setRelation] = useState(0)
  const myuid = useSelector((state) => state.userAuth.user.uid)

  const fecthdetails = async()=>{
    const details = await axios.get(`http://localhost:4500/friends/details?uid=${uid}`)
    if (details.data.friends.includes(myuid)){
      // tick
      setRelation(1)
    }
    else if(details.data.send_requests.includes(myuid)){
      // me accept
      setRelation(-2)
    }
    else if(details.data.receive_requests.includes(myuid)){
      // decline
      setRelation(-1)
    }
    setUser(details.data)
  }

  const userAction = async(action)=>{
    if(action==="add"){
      await axios.put(`http://localhost:4500/friends/send?from=${myuid}&to=${uid}`)
      setRelation(-1)
    }
    else if(action==="accept"){
      await axios.put(`http://localhost:4500/friends/accept?from=${myuid}&to=${uid}`)
      setRelation(1)
    }
    else if(action==="decline"){
      await axios.put(`http://localhost:4500/friends/decline?from=${myuid}&to=${uid}`)
      setRelation(0)
    }
  }

  useEffect(()=>{
    fecthdetails()
  },[uid])

  return (
    <div className={styles.one}>
      {user ?
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
          <div className={styles.status}>{user.status ? "Online" : "Offline"}</div>
        </div>
        {!my ?
        <div className={styles.extend}>
          <div className={styles.cursor}>
            <i class="fa-solid fa-message" title="Message"></i>
          </div>
          <div className={styles.cursor}>
            {relation===0 ? <i class="fa-solid fa-user-plus" title="Add Friend" onClick={()=>userAction("add")}></i> : ""}
            {relation===1 ?<i class="fa-solid fa-user-check" title="Friend" onClick={()=>userAction("friend")}></i> : ""}
            {relation===-1 ? <i class="fa-solid fa-user-xmark" title="Cancel Request" onClick={()=>userAction("decline")}></i> : ""}
            {relation===-2 ? <i class="fa-solid fa-user-clock" title="Accept Request" onClick={()=>userAction("accept")}></i> : ""}
          </div>
        </div> : ""}
      </div>: ""}
    </div>
  );
}

export default User;
