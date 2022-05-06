import React, { useEffect } from "react";
import styles from "./trailer.module.css";
export default function TrailerModal({ link, setOpenTrailer }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible";
    };
  });
  return (
    <div className={styles.modal}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${link}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

      <div onClick={() => setOpenTrailer(false)} className={styles.closebg}>
        <ion-icon name="close"></ion-icon>
      </div>
    </div>
  );
}
