import React from "react";
import styles from "./user.module.css";

export function ProfilePic({ url, name }) {
  return (
    <div className={styles.profile_pic}>
      <img src={url} alt={name[0]} />
    </div>
  );
}
