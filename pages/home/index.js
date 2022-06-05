import Layout from "../../components/Layout";
import styles from "../../styles/Home.module.css";
import Categories from "../../components/Home_categories/Categories";
import { useSelector } from "react-redux";
import { useEffect } from "react";
function Home() {
  const theme = useSelector((state) => state.global.theme);
  const allUsers = useSelector((state) => state.people.allUsers);
  return (
    <div className={styles.home}>
      <Notch />
      <div className={styles.container}>
        <section
          className={`${styles.section_one} ${
            theme === "light" ? styles.ltheme : styles.dtheme
          } `}
        >
          <div className={styles.heading}>
            <div className={styles.title}>
              <h3>Recommend You</h3>
              <p>a movie recommendation web app</p>
            </div>
            {/* <div
              style={{
                maxWidth: "90vw",
                padding: ".5rem",
              }}
              className="elfsight-app-d9a75cd2-55d3-4991-8ecd-783c94d527e4"
            ></div> */}

            <ul className={styles.features}>
              <li>
                <b>Features :-</b>
              </li>
              <li>personalized Home page based on user activity,</li>
              <li>recommendation system</li>
            </ul>
            <p>{"[ this website contains movie data between (1994-2020) ]"}</p>
            {allUsers?.length > 0 && (
              <div className={styles.stats}>
                <h4>Users count: {allUsers.length}</h4>
              </div>
            )}
          </div>
          {/* {authorized ? <MyList /> : ""} */}
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
