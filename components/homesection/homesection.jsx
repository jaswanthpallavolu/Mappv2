import styles from "../../styles/Home.module.css";
import { useSelector } from "react-redux";
import Features from "./Features";

function HomeSection() {
  const theme = useSelector((state) => state.global.theme);
  const allUsers = useSelector((state) => state.people.allUsers);
  return (
    <section
      className={`${styles.section_one} ${
        theme === "light" ? styles.ltheme : styles.dtheme
      } `}
    >
      <div className={styles.heading}>
        <div className={styles.title}>
          <h3>Recommend for You</h3>
          <p>a movie recommendation web app</p>
        </div>
        {/* <div
          style={{
            maxWidth: "90vw",
            padding: ".5rem",
          }}
          className="elfsight-app-d9a75cd2-55d3-4991-8ecd-783c94d527e4"
        ></div> */}

        <Features />
        <p className={styles.note}>
          {"[ this website contains movie data between (1994-2020) ]"}
        </p>
        {allUsers?.length > 0 && (
          <div className={styles.stats}>
            <h4>Users count: {allUsers.length}</h4>
          </div>
        )}
      </div>
      {/* {authorized ? <MyList /> : ""} */}
    </section>
  );
}

export default HomeSection;
