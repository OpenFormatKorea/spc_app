import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthForgotPW from "@/components/layout/auth/AuthForgotPWForm";
import { fetchResetPW } from "@/lib/auth/apis";
import { AuthArgs } from "@/lib/auth/types";
import router from "next/router";
import { useEffect, useRef, useState, KeyboardEvent } from "react";

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   return authenticateUser(context, "/auth/login");
// };

const resetpw = () => {
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);

  const resetPWInfo: AuthArgs = {
    username: username,
  };

  const infoCheck = (info: AuthArgs) => {
    if (!info.username) {
      alert("아이디를 확인 해주세요.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (loading == false) {
      setLoading(true);
      if (infoCheck(resetPWInfo)) {
        const result = await fetchResetPW(resetPWInfo);
        setLoading(false);
        alert(result.message);
        if (result.success) {
          router.push("/auth/login");
        }
      } else {
        alert("비밀번호 설정이 실패하였습니다. 인센토 팀으로 문의를 남겨주세요.");
        setLoading(false);
      }
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
    const isFormValid = username !== "";
    setButtonDisabled(!isFormValid);
  }, [username]);

  return (
    <AuthContainer>
      <AuthForgotPW
        username={username}
        setUsername={setUsername}
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
