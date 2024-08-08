// src/pages/home.tsx
import { getCookie } from "cookies-next";
import { GetServerSidePropsContext } from "next";
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
    <div className="LoginContainer flex justify-center items-center h-screen bg-[#8ace00]">
      <div className="LoginBox min-w-[380px] min-h-[380px] border border-white flex flex-col justify-center items-center">
        <div className="m-10 flex justify-center">
          <img src="/images/incento_logo.png" alt="Incento Logo" className="w-[180px]" />
        </div>
        <div className="p-4 flex items-center justify-center m-10">
          <button id="login" className="mx-2 p-2 bg-gray-300 text-sm" onClick={handleButton}>
            로그인
          </button>
          <button id="signup" className="mx-2 p-2 bg-gray-300 text-sm" onClick={handleButton}>
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
