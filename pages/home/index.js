import Layout from "../../components/Layout";
import styles from "../../styles/Home.module.css";
import Categories from "../../components/Home_categories/Categories";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useRouter } from "next/router";
import MyList from "../../components/Home_categories/MyList";
function Home() {
  const router = useRouter();
  // const user = useSelector((state) => state.currentUser.user.authenticated);
  // useEffect(() => {
  //   if (!user) router.replace("/login");
  // }, [user]); //eslint-disable-line react-hooks/exhaustive-deps
  const authorized = useSelector((state) => state.userAuth.user.authorized);
  return (
    <div className={styles.home}>
      <Notch />
      <div className={styles.container}>
        <section
          className={`${styles.one} ${!authorized ? styles.notlogged : ""}`}
        >
          <div className={styles.heading}>
            <h3>Movie Recommendation</h3>
            <p>this website contains movie data between (1994-2020)</p>
            <ul className={styles.features}>
              <li>
                <b>Features :-</b>
              </li>
              <li>personalized Home page based on user activity,</li>
              <li>recommendation system</li>
            </ul>
          </div>
          {authorized ? <MyList /> : ""}
          {/* <div
            style={{ marginBottom: "10%", maxWidth: "90vw", padding: ".5rem" }}
            className="elfsight-app-d9a75cd2-55d3-4991-8ecd-783c94d527e4"
          ></div> */}
        </section>

        <Categories />
      </div>
    </div>
  );
}

export function Notch() {
  const notchState = () => {
    const notch = document.querySelector("#notch");
    if (notch) {
      if (window.scrollY < window.innerHeight / 3.5) {
        notch.style.transform = "scale(0)";
      } else {
        notch.style.transform = "scale(1)";
      }
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", notchState);
    return () => {
      window.removeEventListener("scroll", notchState);
    };
  }, []);
  return (
    <div
      className={styles.notch}
      id="notch"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <i className="fas fa-arrow-circle-up"></i>
    </div>
  );
}
Home.Layout = Layout;

export default Home;
