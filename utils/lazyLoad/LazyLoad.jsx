import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function LazyLoad({ children }) {
  const { ref, inView } = useInView({ rootMargin: "-80px 0px 0px 0px " });
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!visible && inView) setVisible(inView);
  }, [inView]);
  return (
    <div ref={ref} style={{ minHeight: "30vh", minWidth: "60vw" }}>
      {visible && children}
    </div>
  );
}
