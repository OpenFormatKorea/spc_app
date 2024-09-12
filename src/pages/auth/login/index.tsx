import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthLogin from "@/components/layout/auth/AuthLoginForm";
import { authenticateUserforLogin } from "@/lib/auth";
import { fetchLogIn } from "@/lib/auth/apis";
import { AuthArgs } from "@/lib/auth/types";
import { setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useRef, useState, KeyboardEvent, useEffect } from "react";
export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUserforLogin(context);
};
// src/pages/index.tsx
const Login: React.FC = () => {
  const [showPW, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

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
    const data = result.data;
    const access = data?.access;
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
        setCookie("access", result.data?.access);
        setCookie("refresh", result.data?.refresh);
        setCookie("shop_id", result.data?.shop_id);
        router.push("/dashboard");
      } else {
        alert(result.message);
      }
    } else {
      alert("로그인에 실패하였습니다.");
    }
  };

  return (
    <AuthContainer>
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
    </AuthContainer>
  );
};

export default Login;
