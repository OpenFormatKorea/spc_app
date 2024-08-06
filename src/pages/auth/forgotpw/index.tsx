import { fetchChangePW, fetchResetPW } from "@/pages/auth/lib/apis";
import { AuthArgs } from "@/pages/auth/lib/types";
import { info } from "console";
import router from "next/router";
import { useEffect, useState } from "react";
const resetpw = () => {
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const resetPWInfo: AuthArgs = {
    userName: userName,
    email: email,
  };

  const infoCheck = (info: AuthArgs) => {
    if (!info.userName) {
      alert("아이디를 확인 해 주세요.");
      return false;
    } else if (!info.email || !handleEmailChk(info.email)) {
      alert("이메일을 확인 해 주세요.");
      return false;
    } else {
      return true;
    }
  };

  const handleEmailChk = (email: string) => {
    return emailRegEx.test(email);
  };

  const postResetPW = async (info: AuthArgs) => {
    const result = await fetchResetPW(resetPWInfo);
    return result;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (infoCheck(resetPWInfo)) {
      const result = await postResetPW(resetPWInfo);
      alert(result.message);
      if (result.success) {
        router.push("/auth/login");
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

  useEffect(() => {
    const isFormValid = userName !== "" && email !== "";
    setButtonDisabled(!isFormValid);
  }, [userName, email]);

  return (
    <div className="ForgotPWBox w-full bg-[#8ace00] flex justify-center items-center text-center h-screen">
      <div className="flex justify-center items-center h-screen">
        <div className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6 bg-[#8ace00] flex flex-col justify-center items-center text-center">
          <div className="text-xl m-2">비밀번호 찾기</div>
          <div className="flex w-full m-2 p-1 justify-start items-center text-left">
            <a className="w-[23%] m-2 h-17 text-xs">아이디:</a>
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
            <a className="w-[23%] m-2 h-17 text-xs">이메일:</a>
            <input
              type="text"
              id="email"
              placeholder="이메일을 입력하세요."
              value={email}
              className="emailInput ml-2 text-xs p-2 w-[77%]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="m-2 w-full flex justify-center">
            <button
              disabled={buttonDisabled}
              className={`p-2 w-full text-center m-2 ${buttonDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-black text-white"}`}
              onClick={handleSubmit}
            >
              비밀번호 변경
            </button>
          </div>
          <div className="passwordDiv flex w-full m-1 p-1 justify-center items-center text-left">
            <div className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
              <button id="signup" onClick={handleButton}>
                회원가입
              </button>
            </div>
            <div>|</div>
            <div className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
              <button id="login" onClick={handleButton}>
                로그인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default resetpw;
