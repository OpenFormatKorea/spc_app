import React, { useEffect, useState } from "react";
import { fetchSignUp } from "@/pages/auth/lib/apis";
import { AuthArgs } from "@/pages/auth/lib/types";
import router from "next/router";
import { info } from "console";

const Signup: React.FC = () => {
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordChk, setPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

  const signupInfo: AuthArgs = {
    userName: userName,
    email: email,
    password: password,
  };

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

  const infoCheck = (info: AuthArgs) => {
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

  useEffect(() => {
    const isFormValid = userName !== "" && email !== "" && password !== "" && passwordChk !== "" && instantPWChk;
    setButtonDisabled(!isFormValid);
  }, [userName, email, password, passwordChk, instantPWChk]);

  return (
    <div className="SignUpBox w-full bg-[#8ace00] flex justify-center items-center text-center h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6 bg-[#8ace00] flex flex-col justify-center items-center text-center">
          <div className="text-xl m-2">회원가입</div>
          <div className="flex w-full m-2 p-1 justify-start items-center text-left">
            <a className="w-[23%] m-2 text-xs">아이디:</a>
            <input
              type="text"
              id="username"
              placeholder="아이디를 입력하세요."
              value={userName}
              className="usernameInput ml-2 text-xs p-2 w-[77%]"
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="flex w-full m-2 p-1 justify-start items-center text-left">
            <a className="w-[23%] m-2 text-xs">이메일:</a>
            <input
              type="email"
              id="email"
              placeholder="이메일을 입력하세요."
              value={email}
              className="usernameInput ml-2 text-xs p-2 w-[77%]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex w-full mx-2 mt-2 p-1 justify-start items-center text-left">
            <a className="w-[23%] m-2 text-xs">비밀번호:</a>
            <input
              type={showPW ? "text" : "password"}
              id="password"
              placeholder="비밀번호를 입력하세요."
              value={password}
              className="usernameInput ml-2 text-xs p-2 w-[77%]"
              onChange={handlePasswordChange}
            />
          </div>
          <div className="inline-block w-full text-xs text-left mx-2">
            <p className="ml-2">
              * 비밀번호는 최소 8자, 대문자, 특수기호 포함 [
              <a style={passwordError === "사용 불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</a>]
            </p>
          </div>
          <div className="flex w-full mx-2 mt-2 p-1 justify-start items-center text-left">
            <a className="w-[23%] m-2 text-xs">
              비밀번호
              <br />
              확인:{" "}
            </a>
            <input
              type={showPW ? "text" : "password"}
              id="passwordChk"
              placeholder="비밀번호 확인"
              value={passwordChk}
              className="usernameInput ml-2 text-xs p-2 w-[77%]"
              onChange={handlePasswordChkChange}
            />
          </div>
          <div className="inline-block w-full text-xs text-right mx-2">
            <p className="mr-2">
              [<a style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</a>]
            </p>
          </div>
          <button className="text-xs border m-2 p-1 bg-white cursor-pointer" onClick={() => setShowPw(!showPW)}>
            비밀번호 {showPW ? "숨기기" : "보여주기"}
          </button>
          <div className="m-2 w-full flex justify-center">
            <button
              disabled={buttonDisabled}
              className={`p-2 w-full text-center m-2 cursor-pointer ${buttonDisabled ? "bg-gray-300" : "bg-black text-white"}`}
              onClick={handleSubmit}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Signup;
