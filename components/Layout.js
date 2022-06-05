import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToDB } from "../redux/features/authSlice";
import { fetchMovies, setEmpty } from "../redux/features/userRatingSlice";
import { fetchUserHistory } from "../redux/features/userHistorySlice";
import { getAllUsers } from "../redux/features/peopleSlice";
import Navbar from "./Navbar/Navbar";
import socket from "../socket.connect";

export default function Layout({ children }) {
  const user = useSelector((state) => state.userAuth.user);
  const status = useSelector((state) => state.userAuth.status);
  const userRatingStatus = useSelector((state) => state.userRatings.status);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("123");
    if (status === "idle") {
      socket.emit("add-user", user.uid);
      socket.emit("get-online-users", user.uid);
      dispatch(getAllUsers());
      dispatch(fetchMovies(user.uid));
      dispatch(fetchUserHistory(user.uid));
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
