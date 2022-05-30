import React, { useEffect, useRef, useState } from "react";
import styles from "./people.module.css";
import secStyles from "../iconsection.module.css";
import Friends from "./Friends";
import { FriendRequest } from "./user/User";
import { useDispatch, useSelector } from "react-redux";
import { setReceivedRequest } from "../../../../redux/features/peopleSlice";
import { socket } from "../../../Layout";

export default function People() {
  const [selectedSection, setSelectedSection] = useState(true);

  const [requser, setRequser] = useState([]);

  const [search, setSearch] = useState("");
  const searchHandle = (searchterm) => {
    setSearch(searchterm);
  };

  return (
    <div className={secStyles.icon_section}>
      <div className={styles.people_comp}>
        <div className={styles.menu}>
          <SectionMenu states={{ selectedSection, setSelectedSection }} />
          <SearchBar
            list={selectedSection}
            term={search}
            termHandle={searchHandle}
          />
        </div>
        {selectedSection ? (
          <div className={styles.list}>
            <Friends dataprops={{ requser, setRequser, search }} />
          </div>
        ) : (
          <RequestSection searchTerm={search} />
        )}
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
        placeholder={props.list ? "Search Friends" : "Filter Requests"}
        className={styles.bar}
        value={props.term}
        onChange={getTerm}
        ref={input}
      />
      <div className={styles.icon}>
        <ion-icon name="search-outline"></ion-icon>
      </div>
    </div>
  );
}

export function RequestSection({ searchTerm }) {
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

  const searchRequests = (word) => {
    // console.log(word);
  };

  useEffect(() => {
    fecthRequests(uid);
    if (searchTerm !== "") {
      searchRequests(searchTerm);
    }
  }, [searchTerm, receivedRequests]);

  useEffect(() => {
    fecthRequests(uid);
  }, []);

  return (
    <div key={requser.length}>
      {requser?.map((i) => (
        <FriendRequest userDetails={i} key={i.uid} />
      ))}
    </div>
  );
}
