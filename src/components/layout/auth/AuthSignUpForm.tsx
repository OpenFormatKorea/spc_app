import AuthButton from "@/components/layout/auth/AuthButton";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
import { authenticateUserforLogin } from "@/lib/auth";
import { GetServerSideProps } from "next";
import React, { ChangeEvent, FormEvent } from "react";
export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUserforLogin(context);
};
interface AuthSignUpFormProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  shopName: string;
  setShopName: (value: string) => void;
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
  buttonRef: React.RefObject<HTMLButtonElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const AuthSignUpForm: React.FC<AuthSignUpFormProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  shopName,
  setShopName,
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
  buttonRef,
  handleKeyDown,
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
        onKeyDown={handleKeyDown}
      />
      <AuthInputBox
        label="이메일:"
        type="text"
        id="email"
        placeholder="이메일을 입력하세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <AuthInputBox
        label="자사몰 명:"
        type="text"
        id="shopName"
        placeholder="자사몰 이름을 입력하세요."
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <AuthInputBox
        label="비밀번호:"
        type={showPW ? "text" : "password"}
        id="password"
        placeholder="비밀번호를 입력하세요."
        value={password}
        onChange={handlePasswordChange}
        onKeyDown={handleKeyDown}
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
        onKeyDown={handleKeyDown}
      />
      <div className="inline-block w-full text-xs text-right mx-2">
        <p className="mr-2">
          [<a style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</a>]
        </p>
      </div>
      <button className="text-xs border m-2 p-1 bg-white cursor-pointer" onClick={() => setShowPw(!showPW)}>
        비밀번호 {showPW ? "숨기기" : "보여주기"}
      </button>
      <AuthButton disabled={buttonDisabled} label="회원가입" buttonRef={buttonRef} onClick={handleSubmit} />
    </div>
  );
};
export default AuthSignUpForm;
