// src/pages/home.tsx

import AuthContainer from "@/components/layout/auth/AuthContainer";
import { useRouter } from "next/router";

const HomePage = () => {
  const router = useRouter();
  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    router.push(id);
  };

  const buttonClass =
    "flex w-full cursor-pointer items-center justify-center rounded-lg bg-blue-500 p-2 text-white lg:w-fit";
  return (
    <AuthContainer>
      <div className="LoginBox flex min-h-[380px] min-w-[380px] flex-col items-center justify-center rounded-xl bg-blue-300">
        <div className="m-10 flex justify-center">
          <img
            src="/images/incento_logo.png"
            alt="Incento Logo"
            className="w-[180px]"
          />
        </div>
        <div className="my-10 flex w-[50%] items-center justify-center gap-[20px]">
          <button
            id="auth/login"
            className={buttonClass}
            onClick={handleButton}
          >
            로그인
          </button>
          <button
            id="auth/signup"
            className={buttonClass}
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
