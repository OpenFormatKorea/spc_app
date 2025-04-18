import React, { useEffect, useRef, useState, KeyboardEvent } from "react";
import router from "next/router";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthSignUpForm from "@/components/layout/auth/AuthSignUpForm";
import { fetchSignUp } from "@/lib/auth/apis";
import { AuthArgs } from "@/lib/auth/types";
import LoadingSpinner from "@/components/base/LoadingSpinner";
import { SHA256 } from "crypto-js";

const Signup: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("사용불가능");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const signupInfo: AuthArgs = {
    username: username,
    shop_name: shopName,
    email: email,
    password: SHA256(password).toString(),
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setInstantPWChk(e.target.value === passwordChk);
    setPasswordError(
      passwordPattern.test(e.target.value) ? "사용가능" : "사용불가능",
    );
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
    event.preventDefault();
    if (infoCheck(signupInfo)) {
      const result = await postSignUp(signupInfo);
      alert(result.message);
      if (result.success) {
        router.push("/auth/login");
      }
    } else {
      alert("회원 가입을 실패 하였습니다.");
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
    if (info.password !== SHA256(passwordChk).toString()) {
      alert("비밀번호를 다시 확인 해 주세요.");
      return false;
    } else if (!info.username) {
      alert("아이디를 확인 해 주세요.");
      return false;
    } else if (!info.shop_name) {
      alert("자사몰 명을 확인 해 주세요.");
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
    const isFormValid =
      username !== "" &&
      email !== "" &&
      shopName !== "" &&
      password !== "" &&
      passwordChk !== "" &&
      instantPWChk;
    setButtonDisabled(!isFormValid);
  }, [username, email, shopName, password, passwordChk, instantPWChk]);

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <AuthContainer>
        <AuthSignUpForm
          username={username}
          setUsername={setUsername}
          email={email}
          setEmail={setEmail}
          shopName={shopName}
          setShopName={setShopName}
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
        />
      </AuthContainer>
    </>
  );
};
export default Signup;
