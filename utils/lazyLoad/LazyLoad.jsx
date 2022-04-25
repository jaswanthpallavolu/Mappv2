import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LazyLoad({ children }) {
  const { ref, inView, entry } = useInView({
    rootMargin: "-10px 0px 0px 0px ",
  });
  const [visible, setVisible] = useState(false);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (!visible && inView) {
      setVisible(inView);
      setTimeout(() => {
        if (
          Math.floor(entry.target.clientHeight) <=
          Math.floor(window.innerHeight * 0.3)
        )
          setHide(true);
      }, 1000);
    }
  }, [inView]);
  return (
    <>
      {!hide ? (
        <div
          ref={ref}
          style={{
            minHeight: "30vh",
            minWidth: "60vw",
          }}
        >
          {visible && children}
        </div>
      ) : (
        ""
      )}
    </>
  );
}
