import React, { useEffect, useRef, useState } from "react";
import styles from "./people.module.css";
import secStyles from "../iconsection.module.css";
import fstyles from "./friends.module.css";
import Friends from "./Friends";
import { FriendRequest } from "./user/User";
import { useSelector } from "react-redux";

export default function People({ closeAll }) {
  const [selectedSection, setSelectedSection] = useState(true);
  const theme = useSelector((state) => state.global.theme);

  const [requser, setRequser] = useState([]);

  const [search, setSearch] = useState("");
  const searchHandle = (searchterm) => {
    setSearch(searchterm);
  };

  return (
    <div className={secStyles.icon_section}>
      <div
        className={`${styles.people_comp}  ${
          theme === "dark" ? styles.dtheme : styles.ltheme
        }`}
      >
        <div className={secStyles.header}>
          <h3 className={secStyles.title}>people</h3>
          <i onClick={closeAll} className="fa-solid fa-xmark"></i>
        </div>

        <div className={styles.menu}>
          <SectionMenu states={{ selectedSection, setSelectedSection }} />
        </div>
        <div className={`${secStyles.custom_scroll}`}>
          {selectedSection ? (
            <>
              <SearchBar
                list={selectedSection}
                term={search}
                termHandle={searchHandle}
              />
              <div className={styles.list}>
                <Friends dataprops={{ requser, setRequser, search }} />
              </div>
            </>
          ) : (
            <RequestSection searchTerm={search} />
          )}
        </div>
      </div>
    </div>
  );
}

export function SectionMenu(props) {
  const receivedRequests = useSelector(
    (state) => state.people.receivedRequests
  );
  const { selectedSection, setSelectedSection } = props.states;
  const leftHandle = () => setSelectedSection(true);
  const rightHandle = () => setSelectedSection(false);

  return (
    <div className={styles.Toggle}>
      <div className={styles.switch}>
        <div
          onClick={leftHandle}
          className={`${styles.left} ${selectedSection ? styles.active : ""}`}
        >
          <i className="fa-solid fa-user-group" />
        </div>
        <div
          onClick={rightHandle}
          className={`
            ${styles.right}
            ${!selectedSection ? styles.active : ""}
            ${receivedRequests.length ? styles.notify : ""}`}
        >
          <i className="fa-solid fa-user-plus"></i>
        </div>
      </div>
    </div>
  );
}

export function SearchBar(props) {
  const input = useRef("");
  const getTerm = () => {
    props.termHandle(input.current.value);
  };

  return (
    <div className={styles.search}>
      <input
        placeholder={
          props.list ? "Search Friends" : "Filter Requests (not completed)"
        }
        // placeholder="search user/ friend"
        className={styles.bar}
        value={props.term}
        onChange={getTerm}
        ref={input}
      />
      <div className={styles.sicon}>
        <ion-icon name="search-outline"></ion-icon>
      </div>
    </div>
  );
}

export function RequestSection() {
  const [requser, setRequser] = useState([]);
  const uid = useSelector((state) => state.userAuth.user.uid);
  const allUsers = useSelector((state) => state.people.allUsers);
  const receivedRequests = useSelector(
    (state) => state.people.receivedRequests
  );
  const fecthRequests = () => {
    const details = receivedRequests.map((i) => {
      return i.uid;
    });
    // console.log(details);
    details = allUsers?.filter((i) => details.includes(i.uid));
    setRequser(details);
  };

  // const searchRequests = (word) => {
  //   // console.log(word);
  // };

  useEffect(() => {
    fecthRequests(uid);
    // if (searchTerm !== "") {
    //   searchRequests(searchTerm);
    // }
  }, [receivedRequests]);

  useEffect(() => {
    fecthRequests(uid);
  }, []);

  return (
    <div key={requser.length}>
      <div className={fstyles.online}>
        <h5>Requests [{receivedRequests.length}]</h5>
        {requser?.map((i) => (
          <FriendRequest userDetails={i} key={i.uid} />
        ))}
      </div>
    </div>
  );
}
