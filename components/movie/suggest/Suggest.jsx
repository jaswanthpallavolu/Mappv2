import React, { useState, useEffect } from "react";
import styles from "./suggest.module.css";
import styles2 from "../MovieDetails.module.css";
import icstyle from "../../social_network/iconsection.module.css";
import { useSelector, useDispatch } from "react-redux";
import { setSuggestBox } from "../../../redux/features/generalSlice";
import { TitleHeader } from "../../social_network/SecondaryIcons";
import socket from "../../../socket.connect";
import axios from "axios";
import { Loader1 } from "../../../utils/loaders/Loading";
import { setNotifSignIn } from "../../../redux/features/generalSlice";

export function Suggest({ isMobile, movie }) {
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  const sugOpened = useSelector((state) => state.global.showSuggestBox);
  const dispatch = useDispatch();
  useEffect(() => {
    return () => dispatch(setSuggestBox(false));
  }, []);
  return (
    <>
      <div className={`${styles2.action_group} ${styles.suggest_icon}`}>
        <button
          className={styles2.icon}
          onClick={() =>
            authorized
              ? dispatch(setSuggestBox())
              : dispatch(setNotifSignIn(true))
          }
          style={{
            background: sugOpened ? "var(--base-color)" : "",
            color: sugOpened ? "var(--light-color)" : "",
            opacity: sugOpened ? "1" : ".55",
          }}
        >
          {/* <i className="fa-solid fa-share-nodes"></i> */}
          <i className="fa-solid fa-arrow-up-right-from-square"></i>
        </button>
        <small>suggest</small>
        {sugOpened && !isMobile && <SuggestBox movie={movie} />}
      </div>
    </>
  );
}

export function SuggestBox({ movie }) {
  const userId = useSelector((state) => state.userAuth.user.uid);
  const [suggestTo, setSuggestTo] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [loading, setLoading] = useState();

  const dispatch = useDispatch();
  const closeBox = () => {
    dispatch(setSuggestBox());
  };

  const friends = useSelector((state) => state.people.friends);
  const onlineUsers = useSelector((state) => state.people.onlineUsers);
  const allUsers = useSelector((state) => state.people.allUsers);

  const initializeFriendsList = (suggestedList) => {
    // console.log(suggestedList);
    const fIds = allUsers.filter((i) => friends.some((f) => f.uid === i.uid));
    const flist = fIds.map((i) => ({
      ...i,
      suggested: suggestedList.includes(i.uid),
      online: onlineUsers.includes(i.uid),
    }));
    flist = flist.sort((a, b) => Number(b.online) - Number(a.online));
    // console.log(flist);
    // flist = [...flist, ...flist, ...flist.slice(0, 10)];
    setFriendsList(flist);
    setLoading(false);
  };
  const movieSuggestedTo = async () => {
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_USER_DATA_SERVER}/notifications/suggestedTo?senderId=${userId}&movieId=${movie.movieId}`
      )
      .then((res) => initializeFriendsList(res.data.receiverIds));
  };

  const handleSend = () => {
    if (!suggestTo.length) return;
    socket.emit("suggest-to-friends", {
      senderId: userId,
      receiverIds: suggestTo,
      movie,
    });
    var updList = friendsList.map((f) => {
      if (suggestTo.includes(f.uid)) return { ...f, suggested: true };
      return f;
    });
    setFriendsList(updList);

    setSuggestTo([]);
    setSearchWord("");

    // setTimeout(() => movieSuggestedTo(), 300);
  };

  useEffect(() => {
    setLoading(true);
    movieSuggestedTo();
  }, [onlineUsers, friends]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`${styles.suggest_box}`}>
      <div className={styles.wrapper}>
        <TitleHeader title={"suggest"} close={closeBox} />
        <input
          value={searchWord}
          type="text"
          placeholder="search friend"
          onChange={(e) => {
            setSearchWord(e.target.value);
          }}
        />
        {!loading ? (
          <>
            <div className={icstyle.custom_scroll}>
              {searchWord === "" ? (
                <Friends
                  props={{
                    suggestTo,
                    setSuggestTo,
                    friendsList,
                    setFriendsList,
                    searchWord,
                    movie,
                  }}
                />
              ) : (
                <SearchResult
                  props={{
                    searchWord,
                    suggestTo,
                    setSuggestTo,
                    setFriendsList,
                    friendsList,
                    movie,
                  }}
                />
              )}
            </div>
            <button
              onClick={handleSend}
              className={styles.send}
              style={{ opacity: suggestTo.length ? 1 : 0.45 }}
            >
              Send {suggestTo.length ? `(${suggestTo.length})` : ""}
            </button>
          </>
        ) : (
          <div className={styles.loader_section}>
            <Loader1 />
          </div>
        )}
      </div>
    </div>
  );
}

function Friends({ props }) {
  const {
    suggestTo,
    searchWord,
    setSuggestTo,
    friendsList,
    setFriendsList,
    movie,
  } = props;

  const [more, setMore] = useState(8);
  const seeMore = () => {
    setMore((prev) => prev + 5);
  };
  return (
    <>
      {/* <div className={styles.recent}>
        <p>recent</p>
        <div className={styles.friends}>
          <Friend />
          <Friend /> <Friend /> <Friend />
          <Friend />
        </div>
      </div> */}
      <div className={styles.recent}>
        <p>friends</p>
        <div className={styles.friends}>
          {friendsList?.slice(0, more)?.map((info, index) => (
            <Friend
              props={{
                info,
                setSuggestTo,
                suggestTo,
                searchWord,
                setFriendsList,
                friendsList,
                movie,
              }}
              key={info.uid + index}
            />
          ))}
        </div>
        {more < friendsList.length && (
          <button onClick={seeMore}>see more</button>
        )}
      </div>
    </>
  );
}

function SearchResult({ props }) {
  const {
    searchWord,
    suggestTo,
    setSuggestTo,
    friendsList,
    setFriendsList,
    movie,
  } = props;
  const [searchList, setSearchList] = useState([]);
  const [loading, setLoading] = useState();
  const [more, setMore] = useState(10);
  const seeMore = () => {
    setMore((prev) => prev + 5);
  };
  const searchFriends = () => {
    const s = friendsList.filter(
      (i) =>
        String(i.username)
          .toLowerCase()
          .indexOf(String(searchWord).toLowerCase()) !== -1
    );
    setSearchList(s);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => searchFriends(), 500);
    return () => clearTimeout(timer);
  }, [searchWord]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!loading ? (
        <div className={styles.recent}>
          {searchList.length > 0 ? (
            <>
              <p>result [{searchList.length}]</p>
              <div className={styles.friends}>
                {searchList?.slice(0, more)?.map((info, index) => (
                  <Friend
                    props={{
                      info,
                      setSuggestTo,
                      suggestTo,
                      searchWord,
                      setFriendsList,
                      friendsList,
                      movie,
                    }}
                    key={info.uid + index}
                  />
                ))}
              </div>
            </>
          ) : (
            <h4>no result</h4>
          )}
          {more < searchList.length && (
            <button onClick={seeMore}>see more</button>
          )}
        </div>
      ) : (
        <div className={styles.loader_section}>
          <Loader1 />
        </div>
      )}
    </>
  );
}

function Friend({ props }) {
  const userId = useSelector((state) => state.userAuth.user.uid);
  const {
    info,
    setSuggestTo,
    suggestTo,
    setFriendsList,
    friendsList,
    searchWord,
    movie,
  } = props;
  const [tick, setTick] = useState();
  // const dispatch = useDispatch();
  const handleUnSend = () => {
    socket.emit("unsend-suggestion", {
      senderId: userId,
      receiverId: info.uid,
      movieId: movie.movieId,
    });
    const upd = friendsList.map((i) => {
      if (i.uid === info.uid) return { ...i, suggested: false };
      return i;
    });
    setFriendsList(upd);
  };
  const toggleTick = () => {
    if (info.suggested) return;
    setTick(!tick);
    if (suggestTo.includes(info.uid)) {
      setSuggestTo((prev) => prev.filter((i) => i !== info.uid));
    } else setSuggestTo((prev) => [...prev, info.uid]);
  };
  useEffect(() => {
    if (suggestTo.includes(info.uid)) setTick(true);
    else setTick(false);
  }, [suggestTo]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={`${styles.friend} `} onClick={toggleTick}>
      <div
        className={`${styles.profile_pic}   ${tick ? styles.tick : ""} ${
          styles.status
        } ${info.online ? styles.online : styles.offline}`}
      >
        <img src={info.photoUrl} alt={info.username[0]} />
        {info.suggested && (
          <div
            onClick={handleUnSend}
            title="unsend it"
            className={styles.suggested}
          >
            unsend
          </div>
        )}
      </div>
      <h6 className={styles.username} title={info.username}>
        {info.username}
      </h6>
    </div>
  );
}
