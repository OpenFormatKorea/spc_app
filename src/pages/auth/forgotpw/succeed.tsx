import { SignupArgs } from "@/pages/auth/lib/types";
import { useState } from "react";
const forgotpw = () => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const infoCheck = (email: string) => {
    if (!email) {
      alert("Check your username.");
      return false;
    }
  };
  const postSignUp = (email: string) => {
    console.log(email);
    return email;
  };
  const handleSubmit = () => {
    const handleSubmit = () => {
      if (infoCheck(email)) {
        postSignUp(email);
        return "success";
      }
    };
  };
  return (
    <div
      className="LoginBox"
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
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6"
          style={{
            backgroundColor: "#8ace00",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="text-xl m-2">비밀번호 찾기</div>
          <div className="flex w-full m-2 p-1 justify-left align-left text-left items-center">
            <a className="w-[20%] m-2 h-17">email: </a>
            <input
              type="text"
              id="username"
              placeholder=" 이메일을 입력하세요."
              value={email}
              className="usernameInput ml-2 text-xs p-2 w-[65%]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
    </div>
  );
};
export default forgotpw;
