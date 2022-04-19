import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.push("/login", undefined, { shallow: true });
  }, []); //eslint-disable-line react-hooks/exhaustive-deps
  return <></>;
}
