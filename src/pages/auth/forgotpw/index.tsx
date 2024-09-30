import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthForgotPW from "@/components/layout/auth/AuthForgotPWForm";
import { authenticateUser } from "@/lib/auth";
import { fetchResetPW } from "@/lib/auth/apis";
import { AuthArgs } from "@/lib/auth/types";
import { GetServerSideProps } from "next";
import router from "next/router";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUser(context, "/auth/login");
};
const resetpw = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const resetPWInfo: AuthArgs = {
    username: username,
    email: email,
  };

  const infoCheck = (info: AuthArgs) => {
    if (!info.username) {
      alert("아이디를 확인 해주세요.");
      return false;
    } else if (!info.email) {
      alert("이메일을 확인 해주세요.");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (infoCheck(resetPWInfo)) {
      const result = await fetchResetPW(resetPWInfo);
      if (result.success) {
        alert(result.message);

        router.push("/auth/changepw");
      }
    } else {
      alert("임시 비밀번호 발급을 실패하였습니다.");
    }
  };

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === "login") {
      router.push("/auth/login");
    } else if (id === "signup") {
      router.push("/auth/signup");
    }
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  useEffect(() => {
    const isFormValid = username !== "" && email !== "";
    setButtonDisabled(!isFormValid);
  }, [username, email]);

  return (
    <AuthContainer>
      <AuthForgotPW
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        handleButton={handleButton}
        handleSubmit={handleSubmit}
        buttonDisabled={buttonDisabled}
        buttonRef={buttonRef}
        handleKeyDown={handleKeyDown}
      />
    </AuthContainer>
  );
};
export default resetpw;
