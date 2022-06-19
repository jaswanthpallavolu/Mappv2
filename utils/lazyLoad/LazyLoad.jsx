import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import styles from "./lazyload.module.css";

export default function LazyLoad({ children }) {
  const { ref, inView } = useInView({
    rootMargin: "0px 0px -100px 0px ",
  });
  const [visible, setVisible] = useState(false);
  // const [hide, setHide] = useState(false);
  useEffect(() => {
    if (!visible && inView) setVisible(inView);
    // setTimeout(() => {
    //   console.log(
    //     Math.floor(entry.target.clientHeight),
    //     Math.floor(window.innerHeight * 0.32)
    //   );
    //   if (
    //     Math.floor(entry.target.clientHeight) <=
    //     Math.floor(window.innerHeight * 0.32)
    //   )
    //     setHide(true);
    // }, 700);
  }, [inView]);
  return (
    <div ref={ref} className={styles.container}>
      {visible && children}
    </div>
  );
}
