import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LazyLoad({ children }) {
  const { ref, inView } = useInView({
    rootMargin: "-50px 0px 0px 0px ",
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
    <div
      ref={ref}
      style={{
        minHeight: "30vh",
        minWidth: "60vw",
      }}
    >
      {visible && children}
    </div>
  );
}
