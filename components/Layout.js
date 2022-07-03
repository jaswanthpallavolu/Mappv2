import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToDB } from "../redux/features/authSlice";
import { fetchMovies, setEmpty } from "../redux/features/userRatingSlice";
import { fetchUserHistory } from "../redux/features/userHistorySlice";
import { getAllUsers } from "../redux/features/peopleSlice";
import Navbar from "./Navbar/Navbar";
import socket from "../socket.connect";
import { Notch } from "../pages/home";
import customeStyles from "../styles/customstyles.module.css";
import { getAuth } from "firebase/auth";
export default function Layout({ children }) {
  const user = useSelector((state) => state.userAuth.user);
  const status = useSelector((state) => state.userAuth.status);

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log("123");
    const auth = getAuth();

    const user = auth.currentUser;
    if (user) {
      user.getIdToken().then((tokenId) => {
        // console.log(tokenId);
        // getAuth()
        //   .verifyIdToken(tokenId)
        //   .then((decodedToken) => {
        //     const uid = decodedToken.uid;
        //     console.log(uid);
        //     // ...
        //   });
      });
    }
    if (status === "idle" && user) {
      socket.emit("add-user", user.uid);
      socket.emit("get-online-users", user.uid);
      dispatch(getAllUsers());
      dispatch(fetchMovies(user.uid));
      dispatch(fetchUserHistory(user.uid));
    }

    // if (status === "loggedout") {
    //   dispatch(setEmpty());
    // }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={customeStyles.main_scrollbar}>
      <Navbar />
      <Notch />
      {children}
    </div>
  );
}
