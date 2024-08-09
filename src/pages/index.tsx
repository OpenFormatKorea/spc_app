// src/pages/index.tsx
//redirect to home when hits /index
import { GetServerSideProps } from "next";
const Index = () => {
  return null;
};
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    redirect: {
      destination: "/auth/login",
      permanent: false,
    },
  };
};
export default Index;
