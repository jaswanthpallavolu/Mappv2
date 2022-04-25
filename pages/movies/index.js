import React from "react";
import Layout from "../../components/Layout";
import styles from "../../styles/Movies.module.css";
import { useRouter } from "next/router";

export default function Movies() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <h1>Movies section</h1>
      <button onClick={() => router.push("/home")}>go to home</button>
    </div>
  );
}

Movies.Layout = Layout;
