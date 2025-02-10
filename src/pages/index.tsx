// src/pages/index.tsx
//redirect to home when hits /index
import { useRouter } from "next/router";
import { useEffect } from "react";
const Index = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/auth/login");
  }, [router]);

  return null;
};

export default Index;
