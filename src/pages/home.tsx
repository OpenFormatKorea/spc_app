// src/pages/home.tsx

import AuthContainer from "@/components/layout/auth/AuthContainer";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === "login") {
      router.push("auth/login");
    } else if (id === "signup") {
      router.push("auth/signup");
    }
  };

  return (
    <AuthContainer>
      <div className="LoginBox min-w-[380px] min-h-[380px] rounded-xl bg-blue-200 flex flex-col justify-center items-center">
        <div className="m-10 flex justify-center">
          <img src="/images/incento_logo.png" alt="Incento Logo" className="w-[180px]" />
        </div>
        <div className="flex w-[50%] items-center justify-center my-10 space-x-6">
          <button
            id="login"
            className=" p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-blue-500"
            onClick={handleButton}
          >
            로그인
          </button>
          <button
            id="signup"
            className=" p-2 w-full lg:w-fit text-white rounded-lg cursor-pointer flex items-center justify-center bg-blue-500"
            onClick={handleButton}
          >
            회원가입
          </button>
        </div>
      </div>
    </AuthContainer>
  );
};

export default HomePage;
