import { fetchLogIn } from "@/pages/auth/lib/apis";
import { AuthArgs } from "@/pages/auth/lib/types";
import router from "next/router";
import { useEffect, useState } from "react";

// src/pages/index.tsx
const Login: React.FC = () => {
  const [showPW, getShowPw] = useState(false);
  const [userName, getUsername] = useState("");
  const [password, getPassword] = useState("");

  const emailRegEx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const loginInfo: AuthArgs = {
    userName: userName,
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
    if (!info.userName) {
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
        console.log(loginInfo.userName + " 님 로그인 하셨습니다.");
        router.push("/home");
      } else {
        alert(result.message);
      }
    } else {
      alert("로그인에 실패하였습니다.");
    }
  };

  return (
    <>
      <div
        className="LoginBox"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="inblock min-w-[350px] bg-blue-200 text-center rounded-lg p-4">
          <form>
            <h1 className="m-2 text-center text-lg font-bold">로그인</h1>
            <div className="emailDiv flex w-full m-2 p-1 justify-left align-left text-left items-center">
              <p className="w-[20%] text-sm font-bold m-2">e-mail</p>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className="border-black border p-2 w-[55%]"
                value={userName}
                onChange={(e) => getUsername(e.target.value)}
              />
            </div>
            <div className="passwordDiv flex w-full m-2 p-1 justify-left align-left text-left items-center">
              <p className="w-[20%] text-sm font-bold m-2">Password </p>
              <input
                type={showPW ? "text" : "password"}
                placeholder="비밀번호를 입력하세요"
                className="border-black border p-2 w-[55%]"
                value={password}
                onChange={(e) => getPassword(e.target.value)}
              />
              <div
                className="ml-2 rounded-md text-xs w-[17%] text-white bg-blue-300 text-center p-2"
                onClick={() => getShowPw(!showPW)}
              >
                pw보기
              </div>
            </div>
          </form>
          <div className="passwordDiv flex w-full m-1 p-1 justify-center align-left text-left items-center">
            <div className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
              <button id="signup" onClick={handleButton}>
                회원가입
              </button>
            </div>
            <div>|</div>
            <div id="forgotpw" className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
              <button id="forgotpw" onClick={handleButton}>
                비밀번호 찾기
              </button>
            </div>
          </div>
          <button
            className="m-1 p-3 text-xs bg-blue-300 rounded-xl text-white font-medium cursor-pointer"
            onClick={handleSubmit}
          >
            로그인
          </button>
        </div>
      </div>
    </>
  );
};

export default Login;
