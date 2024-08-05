import React, { useState } from "react";
import { fetchSignUp } from "@/pages/auth/lib/apis";
import { SignupArgs } from "@/pages/auth/lib/types";

const Signup: React.FC = async () => {
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,12}$/;

  // const signupInfo: SignupArgs = {
  //   userName: userName,
  //   email: email,
  //   password: password,
  // };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (!passwordPattern.test(e.target.value)) {
      setPasswordError("사용 불가능");
    } else {
      setPasswordError("사용 가능");
    }
  };

  const handlePasswordChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordChk(e.target.value);
    if (e.target.value !== password) {
      setInstantPWChk(false);
    } else {
      setInstantPWChk(true);
    }
  };

  const handleEmailChk = (email: string) => {
    return emailRegEx.test(email);
  };

  const postSignUp = async (info: SignupArgs) => {
    const result = await fetchSignUp(info);
    setMessage(result.message);
  };

  const infoCheck = (info: SignupArgs) => {
    if (info.password !== passwordChk) {
      alert("Passwords do not match.");
      return false;
    } else if (!info.userName) {
      alert("Check your username.");
      return false;
    } else if (!info.email || !handleEmailChk(info.email)) {
      alert("Check your email.");
      return false;
    } else if (!info.password) {
      alert("Check your password.");
      return false;
    } else {
      return true;
    }
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const signupInfo: SignupArgs = {
      userName,
      email,
      password,
    };

    if (infoCheck(signupInfo)) {
      await postSignUp(signupInfo);
    }
  };
  return (
    <div
      className="containerBox"
      style={{
        width: "full",
        backgroundColor: "#8ace00",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <div
        className="min-w-[380px] w-[40vh] border-2 p-6"
        style={{
          // width: 'full',
          // height: 'full',
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-xl m-2">회원가입</div>
        <div className="flex w-full m-2 p-1 justify-left align-left text-left items-center">
          <a className="w-[32%] m-2 h-17">user name: </a>
          <input
            type="text"
            id="username"
            placeholder="아이디를 입력하세요."
            value={userName}
            className="usernameInput ml-2 text-xs p-2 w-[55%]"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="flex w-full m-2 p-1 justify-left align-left text-left items-center">
          <a className="w-[32%] m-2 h-17">email: </a>
          <input
            type="email"
            id="email"
            placeholder="이메일을 입력하세요."
            value={email}
            className="usernameInput ml-2 text-xs p-2 w-[55%]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex w-full mx-2 mt-2 p-1 justify-left align-left text-left items-center">
          <a className="w-[32%] m-2 h-17">password: </a>
          <input
            type={showPW ? "text" : "password"}
            id="password"
            placeholder="비밀번호를 입력하세요."
            value={password}
            className="usernameInput ml-2 text-xs p-2 w-[55%]"
            onChange={handlePasswordChange}
          />
        </div>
        <div className="inblock w-full text-xs text-left mx-2">
          <p className="ml-2 h-17">
            * 비밀번호는 최소 8자, 대문자, 특수기호 포함{" "}
            <a style={passwordError ? { color: "red" } : { color: "green" }}>{passwordError}</a>
          </p>
        </div>
        <div className="flex w-full mx-2 mt-2 p-1 justify-left align-left text-left items-center">
          <a className="w-[32%] m-2 h-17">pw check: </a>
          <input
            type={showPW ? "text" : "password"}
            id="passwordChk"
            placeholder="비밀번호 확인"
            value={passwordChk}
            className="usernameInput ml-2 text-xs  p-2 w-[55%]"
            onChange={handlePasswordChkChange}
          />
        </div>
        <button className="text-xs border m-2 bg-white" onClick={() => setShowPw(!showPW)}>
          {showPW ? "hide" : "show"} pw
        </button>

        <div className="m-2">
          <button
            className={`p-2 text-center m-2 ${buttonDisabled ? " bg-gray-300 cursor-not-allowed" : " bg-black text-white"}`}
            onClick={handleSubmit}
          >
            sign up
          </button>
        </div>
      </div>
    </div>
  );
};
export default Signup;
