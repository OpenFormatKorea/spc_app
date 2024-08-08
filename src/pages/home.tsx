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
      <div className="LoginBox min-w-[350px] min-h-[350px] border-2 border-white flex justify-center items-center">
        <div className="inline-block w-[100%] h-[100%]">
          <div className=" flex justify-center m-10">
            <img src="/images/incento_logo.png" alt="Incento Logo" />
          </div>
          <div className="p-4 flex items-center justify-center space-x-2 m-10">
            <button id="login" className="p-2  bg-gray-300 text-auto text-sm" onClick={handleButton}>
              로그인
            </button>
            <button id="signup" className="p-2  bg-gray-300 text-auto text-sm" onClick={handleButton}>
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
