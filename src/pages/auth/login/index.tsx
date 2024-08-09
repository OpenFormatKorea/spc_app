import AuthLogin from "@/components/layout/authlayout/AuthLoginForm";
import { authenticateUserforLogin } from "@/lib/auth";
import { fetchLogIn } from "@/pages/auth/lib/apis";
import { AuthArgs } from "@/pages/auth/lib/types";
import { setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, useState, KeyboardEvent } from "react";
export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUserforLogin(context);
};
// src/pages/index.tsx
const Login: React.FC = () => {
  const [showPW, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const loginInfo: AuthArgs = {
    username: username,
    password: password,
  };

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === "forgotpw") {
      router.push("/auth/forgotpw");
    } else if (id === "signup") {
      router.push("/auth/signup");
    }
  };

  const postLogin = async (info: AuthArgs) => {
    const result = await fetchLogIn(info);
    return result;
  };

  const infoCheck = (info: AuthArgs) => {
    if (!info.username) {
      alert("아이디를 확인 후 다시 시도해주세요.");
      return false;
    } else if (!info.password) {
      alert("비밀번호를 확인 후 다시 시도해주세요.");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (infoCheck(loginInfo)) {
      const result = await postLogin(loginInfo);
      if (result.success) {
        setCookie("username", loginInfo.username);
        console.log(loginInfo.username + " 님 로그인 하셨습니다.");
        router.push("/dashboard");
      } else {
        alert(result.message);
      }
    } else {
      alert("로그인에 실패하였습니다.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default form submission behavior if it's in a form element
      if (buttonRef.current) {
        buttonRef.current.click(); // Trigger the click event on the login button
      }
    }
  };

  return (
    <div className="AuthContainer w-full bg-[#8ace00] flex justify-center items-center text-center h-screen">
      <div className="flex justify-center items-center h-screen">
        <AuthLogin
          username={username}
          setUsername={setUsername}
          showPW={showPW}
          password={password}
          setPassword={setPassword}
          buttonDisabled={false}
          setShowPw={setShowPw}
          handleButton={handleButton}
          handleSubmit={handleSubmit}
          buttonRef={buttonRef}
          handleKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default Login;
