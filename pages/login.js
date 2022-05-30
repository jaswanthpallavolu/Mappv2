import { useEffect, useState } from "react";

import styles from "../styles/Login.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loginWithGoogle } from "../redux/features/authSlice";
import { useRouter } from "next/router";
// import Image from "next/image";
import { Loader1 } from "../utils/loaders/Loading";

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  // const loading1 = useSelector((state) => state.userAuth.status);
  const authorized = useSelector((state) => state.userAuth.user.authorized);

  useEffect(() => {
    // console.log(`login:${access}`);
    if (authorized) router.replace("/home", undefined, { shallow: true });
  }, [authorized]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.container}>
      {loading ? (
        <div className={styles.l_loader}>
          <Loader1 />
          <div className={styles.status}>Loading please wait..</div>
        </div>
      ) : (
        <>
          <div className={styles.bg}>
            <img
              className={styles.bgimg1}
              src="/assets/land1.png"
              alt="bgimg"
            />
            {/* <Image
              priority
              alt="bgimg1"
              layout="fill"
              objectPosition="65%"
              objectFit="cover"
              src="/assets/land1.png"
            /> */}
          </div>
          <div className={styles.content}>
            <div className={styles.desc}>
              {"You don't watch the movies the way you did as a kid"}
            </div>
            <div className={styles.lbtn}>
              <button
                className={styles.signin}
                onClick={() => {
                  dispatch(loginWithGoogle());
                  setLoading(true);
                }}
              >
                SignIn with Google
              </button>
              <button
                className={styles.guest}
                onClick={() => router.push("/home")}
              >
                view as a guest
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
