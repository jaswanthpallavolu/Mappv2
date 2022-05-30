import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToDB, setUserStatus } from "../redux/features/authSlice";
import { fetchMovies, setEmpty } from "../redux/features/userRatingSlice";
import { fetchUserHistory } from "../redux/features/userHistorySlice";
import Navbar from "./Navbar/Navbar";
import { io } from "socket.io-client";
import {
  fetchFriends,
  setFriends,
  setSentRequest,
  setReceivedRequest,
} from "../redux/features/peopleSlice";
// import { useRouter } from "next/router";
export const socket = io.connect(process.env.NEXT_PUBLIC_USER_DATA_SERVER);

export default function Layout({ children }) {
  const allUsers = useSelector((state) => state.people.allUsers);
  const uid = useSelector((state) => state.userAuth.user.uid);
  const user = useSelector((state) => state.userAuth.user);
  const status = useSelector((state) => state.userAuth.status);
  const userRatingStatus = useSelector((state) => state.userRatings.status);

  const dispatch = useDispatch();

  const dispathFriends = async (uid) => {
    const details = await dispatch(fetchFriends(uid));
    dispatch(setFriends(details.payload.friends));
    dispatch(setSentRequest(details.payload.sentRequests));
    dispatch(setReceivedRequest(details.payload.receivedRequests));
  };

  useEffect(() => {
    if (userRatingStatus === "succeeded") {
      // setLoggedIn(true);
      if (uid) dispatch(fetchMovies(uid));
    }
    // if (userRatingsStatus === "loaded") dispatch(reloadList());
  }, [userRatingStatus]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (status === "succeeded") {
      // console.log(uid);
      // if (!uid) router.replace("/login");
      if (uid) {
        socket.emit("get-online-users", uid);
        socket.emit("add-user", uid);
        dispatch(fetchMovies(uid));
        dispatch(fetchUserHistory(uid));
        dispathFriends(uid);
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
