import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToDB, setUserStatus } from "../redux/features/authSlice";
import { fetchMovies, setEmpty } from "../redux/features/userRatingSlice";
import { fetchUserHistory } from "../redux/features/userHistorySlice";
import Navbar from "./Navbar/Navbar";
import socket from "../socket.connect";

// import {
//   fetchFriends,
//   setFriends,
//   setSentRequest,
//   setReceivedRequest,
// } from "../redux/features/peopleSlice";
// import { useRouter } from "next/router";

export default function Layout({ children }) {
  const allUsers = useSelector((state) => state.people.allUsers);
  const uid = useSelector((state) => state.userAuth.user.uid);
  const user = useSelector((state) => state.userAuth.user);
  const status = useSelector((state) => state.userAuth.status);
  const userRatingStatus = useSelector((state) => state.userRatings.status);

  const dispatch = useDispatch();

  useEffect(() => {
    if (userRatingStatus === "succeeded") {
      if (uid) dispatch(fetchMovies(uid));
    }
  }, [userRatingStatus]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === "succeeded") {
      if (uid) {
        socket.emit("get-online-users", uid);
        socket.emit("add-user", uid);
        dispatch(fetchMovies(uid));
        dispatch(fetchUserHistory(uid));
      }
      const a = allUsers.filter((i) => i.uid === uid);
      if (a.length === 0 && uid) {
        dispatch(addToDB(user));
      } else if (uid) {
        dispatch(setUserStatus("idle"));
        // console.log('old User')
      }
    }
    if (status === "loggedout") {
      dispatch(setEmpty());
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
