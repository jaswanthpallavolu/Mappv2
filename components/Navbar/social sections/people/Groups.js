import React, { useEffect, useRef, useState } from "react";
import styles from "./Groups.module.css";
import Friends from "./Friends";
import User from "./User";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Groups() {
  const [selectedSection, setSelectedSection] = useState(true);

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
          <Friends searchTerm={search} />
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

export function RequestSection({searchTerm}) {
  const [user,setuser] = useState()
  const uid = useSelector((state) => state.userAuth.user.uid)

  const fecthRequests = async(uid)=>{
    const details = await axios.get(`http://localhost:4500/friends/details?uid=${uid}`)
    setuser(details.data.send_requests.concat(details.data.receive_requests))
  }

  const searchRequests = (word)=>{
    console.log(word)
  }

  useEffect(()=>{
    fecthRequests(uid)
    if (searchTerm!==""){
      searchRequests(searchTerm)
    }
  },[uid,searchTerm])

  return (
    <div>
      {user && user.map(i=><User uid={i} key={i}/>)}
    </div>
  )
}
