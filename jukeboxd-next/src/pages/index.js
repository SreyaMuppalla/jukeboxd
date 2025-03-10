import { useRouter } from "next/router";
import { useEffect } from "react";

export default function () {
  const router = useRouter();

  useEffect(() => {
    if (location.pathname === "/") router.push("/login-page");
    else router.push(location.pathname);
  }, []);

  return (
    <div style={{ backgroundColor: 'black', color: 'white', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0 }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold', textAlign: 'center' }}>
        Loading Page...
      </div>
    </div>
  );
};
