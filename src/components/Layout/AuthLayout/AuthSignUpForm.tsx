import AuthButton from "@/components/Layout/AuthLayout/AuthButton";
import AuthInputBox from "@/components/Layout/AuthLayout/AuthInputBox";
import React, { ChangeEvent, FormEvent } from "react";
interface AuthSignUpFormProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  showPW: boolean;
  password: string;
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  passwordError: string;
  passwordChk: string;
  handlePasswordChkChange: (e: ChangeEvent<HTMLInputElement>) => void;
  instantPWChk: boolean;
  buttonDisabled: boolean;
  setShowPw: (value: boolean) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
}
const AuthSignUpForm: React.FC<AuthSignUpFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  showPW,
  password,
  handlePasswordChange,
  passwordError,
  passwordChk,
  handlePasswordChkChange,
  instantPWChk,
  buttonDisabled,
  setShowPw,
  handleSubmit,
}) => {
  return (
    <div className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6 bg-[#8ace00] flex flex-col justify-center items-center text-center">
      <div className="text-xl m-2">회원가입</div>
      <AuthInputBox
        label="아이디:"
        type="text"
        id="username"
        placeholder="아이디를 입력하세요."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <AuthInputBox
        label="이메일:"
        type="email"
        id="email"
        placeholder="이메일을 입력하세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <AuthInputBox
        label="비밀번호:"
        type={showPW ? "text" : "password"}
        id="password"
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={handlePasswordChange}
      />
      <div className="inline-block w-full text-xs text-left mx-2">
        <p className="ml-2">
          * 비밀번호는 최소 8자, 대문자, 특수기호 포함 [
          <a style={passwordError === "사용 불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</a>]
        </p>
      </div>
      <AuthInputBox
        label="비밀번호 확인:"
        type={showPW ? "text" : "password"}
        id="passwordChk"
        placeholder="비밀번호 확인"
        value={passwordChk}
        onChange={handlePasswordChkChange}
      />
      <div className="inline-block w-full text-xs text-right mx-2">
        <p className="mr-2">
          [<a style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</a>]
        </p>
      </div>
      <button className="text-xs border m-2 p-1 bg-white cursor-pointer" onClick={() => setShowPw(!showPW)}>
        비밀번호 {showPW ? "숨기기" : "보여주기"}
      </button>
      <AuthButton disabled={buttonDisabled} label="회원가입" onClick={handleSubmit} />
    </div>
  );
};
export default AuthSignUpForm;
