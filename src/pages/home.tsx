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
      <div className="LoginBox flex min-h-[380px] min-w-[380px] flex-col items-center justify-center rounded-xl bg-gradient-to-b from-blue-200 to-blue-300">
        <div className="m-10 flex justify-center">
          <img
            src="/images/incento_logo.png"
            alt="Incento Logo"
            className="w-[180px]"
          />
        </div>
        <div className="my-10 flex w-[50%] items-center justify-center space-x-6">
          <button
            id="login"
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white lg:w-fit"
            onClick={handleButton}
          >
            로그인
          </button>
          <button
            id="signup"
            className="flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white lg:w-fit"
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
