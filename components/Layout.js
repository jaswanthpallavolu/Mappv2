import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToDB, setUserStatus } from "../redux/features/authSlice";
import { fetchMovies, setEmpty } from "../redux/features/userRatingSlice";
import Navbar from "./Navbar/Navbar";
import MovieModal from "./Moviedetails/MovieModal";
import { useRouter } from "next/router";
// import { route } from "next/dist/server/router";

export default function Layout({ children }) {
  const all = useSelector((state) => state.userAuth.all);
  const uid = useSelector((state) => state.userAuth.user.uid);
  const user = useSelector((state) => state.userAuth.user);
  const status = useSelector((state) => state.userAuth.status);
  const userRatingStatus = useSelector((state) => state.userRatings.status);
  const movieModalState = useSelector((state) => state.movie.open);
  const router = useRouter();
  const dispatch = useDispatch();

  // domain/home/:word for word in the search bar
  // const searchRef = useRef();

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!uid) router.replace("/login");
  //   }, 2000);
  // }, [uid]); //eslint-disable-line react-hooks/exhaustive-deps
  // const [loggedIn, setLoggedIn] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!uid) router.replace("/login");
  //   }, 1000);
  // }, [uid]);
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
      const a = all.filter((i) => i === uid);
      if (a.length === 0 && uid) {
        dispatch(addToDB(user));
      } else if (uid) {
        dispatch(setUserStatus("idle"));
        // console.log('old User')
      }
      if (uid) dispatch(fetchMovies(uid));
      // setTimeout(() => {
      //   dispatch(fetchMovies(uid));
      // }, 300);
    }
    if (status === "loggedout") {
      dispatch(setEmpty());
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {!movieModalState ? <Navbar /> : ""}
      {children}
      <MovieModal />
    </>
  );
}
