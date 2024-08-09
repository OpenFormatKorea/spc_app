import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import { fetchSignUp } from "@/pages/auth/lib/apis";
import { AuthArgs } from "@/pages/auth/lib/types";
import router from "next/router";
import AuthContainer from "@/components/layout/authlayout/AuthContainer";
import AuthSignUpForm from "@/components/layout/authlayout/AuthSignUpForm";

const Signup: React.FC = () => {
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const signupInfo: AuthArgs = {
    username: username,
    email: email,
    password: password,
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setInstantPWChk(e.target.value === passwordChk);
    setPasswordError(passwordPattern.test(e.target.value) ? "사용 가능" : "사용 불가능");
  };

  const handlePasswordChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordChk(e.target.value);
    setInstantPWChk(e.target.value === password);
  };

  const handleEmailChk = (email: string) => {
    return emailRegEx.test(email);
  };

  const postSignUp = async (info: AuthArgs) => {
    const result = await fetchSignUp(info);
    return result;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (infoCheck(signupInfo)) {
      const result = await postSignUp(signupInfo);
      alert(result.message);
      if (result.success) {
        router.push("/auth/login");
      }
    } else {
      alert("화원 가입을 실패 하였습니다.");
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

  const infoCheck = (info: AuthArgs) => {
    if (info.password !== passwordChk) {
      alert("비밀번호를 다시 확인 해 주세요.");
      return false;
    } else if (!info.username) {
      alert("아이디를 확인 해 주세요.");
      return false;
    } else if (!info.email || !handleEmailChk(info.email)) {
      alert("이메일을 확인 해 주세요.");
      return false;
    } else if (!info.password) {
      alert("비밀번호를 확인 해 주세요.");
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    const isFormValid = username !== "" && email !== "" && password !== "" && passwordChk !== "" && instantPWChk;
    setButtonDisabled(!isFormValid);
  }, [username, email, password, passwordChk, instantPWChk]);

  return (
    <AuthContainer>
      <AuthSignUpForm
        username={username}
        setUsername={setUsername}
        email={email}
        setEmail={setEmail}
        showPW={showPW}
        password={password}
        handlePasswordChange={handlePasswordChange}
        passwordError={passwordError}
        passwordChk={passwordChk}
        handlePasswordChkChange={handlePasswordChkChange}
        instantPWChk={instantPWChk}
        buttonDisabled={buttonDisabled}
        setShowPw={setShowPw}
        handleSubmit={handleSubmit}
        buttonRef={buttonRef}
        handleKeyDown={handleKeyDown}
      ></AuthSignUpForm>
    </AuthContainer>
  );
};
export default Signup;
