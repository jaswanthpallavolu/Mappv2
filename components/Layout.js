import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToDB, setUserStatus } from "../redux/features/authSlice";
import { fetchMovies } from "../redux/features/userDataSlice";
import Navbar from "./Navbar/Navbar";
import MovieModal from "./Moviedetails/MovieModal";
import { useRouter } from "next/router";
// import { route } from "next/dist/server/router";

export default function Layout({ children }) {
  const all = useSelector((state) => state.currentUser.all);
  const uid = useSelector((state) => state.currentUser.user.uid);
  const user = useSelector((state) => state.currentUser.user);
  const status = useSelector((state) => state.currentUser.status);
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
  const statusm = useSelector((state) => state.userData.status);
  // const [loggedIn, setLoggedIn] = useState(false);
  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!uid) router.replace("/login");
  //   }, 1000);
  // }, [uid]);
  useEffect(() => {
    if (statusm === "succeeded") {
      // setLoggedIn(true);
      dispatch(fetchMovies(uid));
    }
    // if (statusm === "loaded") dispatch(reloadList());
  }, [statusm, uid]); //eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (status === "succeeded") {
      // console.log(uid);
      if (!uid) router.replace("/login");
      const a = all.filter((i) => i === uid);
      if (a.length === 0 && uid) {
        dispatch(addToDB(user));
      } else if (uid) {
        dispatch(setUserStatus("idle"));
        // console.log('old User')
      }
      dispatch(fetchMovies(uid));
      // setTimeout(() => {
      //   dispatch(fetchMovies(uid));
      // }, 300);
    }
  }, [status]); //eslint-disable-line react-hooks/exhaustive-deps

  if (uid) {
    return (
      <>
        {!movieModalState ? <Navbar /> : ""}
        {children}
        <MovieModal />
      </>
    );
  } else return "";
}
