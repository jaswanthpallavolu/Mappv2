import React from "react";
import { useRouter } from "next/router";
import Layout from "../../components/Layout";

export default function Movie() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      movie page: {id}
    </div>
  );
}
Movie.Layout = Layout;
