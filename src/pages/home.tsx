// src/pages/home.tsx

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
    <div className="LoginContainer w-full bg-sky-600 flex justify-center items-center text-center h-screen">
      <div className="LoginBox min-w-[380px] min-h-[380px] rounded-xl bg-gray-300 flex flex-col justify-center items-center">
        <div className="m-10 flex justify-center">
          <img src="/images/incento_logo.png" alt="Incento Logo" className="w-[180px]" />
        </div>
        <div className="flex items-center justify-center m-10 space-x-6">
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
    </div>
  );
};

export default HomePage;
