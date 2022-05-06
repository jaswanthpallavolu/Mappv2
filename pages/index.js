import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.push("/home");
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  return <></>;
}
