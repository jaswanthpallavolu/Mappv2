import React from "react";
import Layout from "../../components/Layout";
import styles from "../../styles/Movies.module.css";
import MoviePage from "../../components/Movies/MoviesPage";

export default function Movies() {
  return (
    <div className={styles.container}>
      <MoviePage />
    </div>
  );
}

Movies.Layout = Layout;
