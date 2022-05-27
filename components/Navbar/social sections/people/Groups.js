import React, { useEffect, useRef, useState } from "react";
import styles from "./Groups.module.css";
import Friends from "./Friends";
import { FriendRequest } from "./User";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedRequest } from "../../../../redux/features/peopleSlice";
import { socket } from "../../../Layout";

export default function Groups() {
  const [selectedSection, setSelectedSection] = useState(true);

  const [requser,setRequser] = useState([])

  const [search, setSearch] = useState("");
  const searchHandle = (searchterm) => {
    setSearch(searchterm);
  };

  return (
    <div className={styles.people_comp}>
      <div className={styles.menu}>
        <SectionMenu states={{ selectedSection, setSelectedSection }} />
        <Search
          list={selectedSection}
          term={search}
          termHandle={searchHandle}
        />
      </div>
      {selectedSection ? (
        <div className={styles.list}>
          <Friends dataprops={{requser,setRequser,search}}/>
        </div>
      ) : (
        <RequestSection searchTerm={search}/>
      )}
    </div>
  );
}

export function SectionMenu(props) {
  const { selectedSection, setSelectedSection } = props.states;
  const leftHandle = () => setSelectedSection(true);
  const rightHandle = () => setSelectedSection(false);

  return (
    <div className={styles.Toggle}>
      <div className={styles.switch}>
        <div
          onClick={leftHandle}
          className={
            selectedSection
              ? `${styles.left} ${styles.active}`
              : `${styles.left}`
          }
        >
          <i className="fa-solid fa-user-group" />
        </div>
        <div
          onClick={rightHandle}
          className={`
            ${styles.right}
            ${!selectedSection ? styles.active : ""}
            ${styles.notify}`}
        >
          <i className="fa-solid fa-user-plus"></i>
        </div>
      </div>
    </div>
  )
}

export function Search(props) {
  const input = useRef("");
  const getTerm = () => {
    props.termHandle(input.current.value)
  }

  return(
    <div className={styles.search}>
        <input
          placeholder={props.list ? 'Search Friends' : 'Filter Requests'}
          className={styles.bar}
          value={props.term}
          onChange={getTerm}
          ref={input}
        />
        <div className={styles.icon}>
            <ion-icon name="search-outline"></ion-icon>
        </div>
    </div>
  )
}

export function RequestSection({ searchTerm }) {
  const [requser,setRequser] = useState()
  const uid = useSelector((state) => state.userAuth.user.uid)
  const all = useSelector((state)=> state.userAuth.all)
  const receivedRequests = useSelector((state) => state.people.receivedRequests)

  const dispatch = useDispatch()

  const fecthRequests = ()=>{
    const details = receivedRequests.map(i=>{return i.uid})
    details = all?.filter(i=>details.includes(i.uid))
    setRequser(details)
  }

  const searchRequests = (word)=>{
    console.log(word)
  }

  useEffect(()=>{
    socket.on("receive-friend-request",(res)=>{
      dispatch(setReceivedRequest([...receivedRequests,{uid:res.senderId,sentRequest:false,time:new Date().toLocaleString(),seen:false,_id:res.senderId}]))
    })
  },[socket])

  useEffect(()=>{
    fecthRequests(uid)
    if (searchTerm!==""){
      searchRequests(searchTerm)
    }
  },[uid,searchTerm,receivedRequests])

  return (
    <div>
      {requser && requser.map(i=><FriendRequest userDetails={i} receive={true} key={i.uid}/>)}
    </div>
  )
}
