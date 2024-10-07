import AuthButton from "@/components/layout/auth/AuthButton";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import React, { ChangeEvent } from "react";

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
    <div className="min-w-[380px] min-h-[380px] rounded-xl p-6 bg-gradient-to-b from-blue-200 to-blue-300 flex flex-col justify-center items-center text-center">
      <div className="text-xl font-semibold m-2 w-full text-left">회원가입</div>
      <div className="flex flex-col w-full items-start justify-between">
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
          label="이메일"
          type="text"
          id="email"
          placeholder="이메일을 입력하세요."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <AuthInputBox
          label="자사몰 명"
          type="text"
          id="shopName"
          placeholder="자사몰 이름을 입력하세요."
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <AuthInputBox
          label="비밀번호"
          type={showPW ? "text" : "password"}
          id="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={handlePasswordChange}
          onKeyDown={handleKeyDown}
        />
        <div className="flex justify-between w-full text-xs text-left mt-2">
          <p className="text-gray-500">*비밀번호는 최소 8자, 대문자, 특수기호 포함</p>
          <span>
            [<span style={passwordError === "사용불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</span>
            ]
          </span>
        </div>
        <div className="flex justify-between w-full items-end text-left">
          <AuthInputBox
            label="비밀번호 확인"
            type={showPW ? "text" : "password"}
            id="passwordChk"
            placeholder="비밀번호 확인"
            value={passwordChk}
            onChange={handlePasswordChkChange}
            onKeyDown={handleKeyDown}
          />

          <button
            className="text-xs border bg-white p-1 ml-2 mb-[5px] cursor-pointer"
            onClick={() => setShowPw(!showPW)}
          >
            {showPW ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
          </button>
        </div>
      </div>
      <div className="flex justify-between w-full text-xs text-left mt-2">
        <p>
          [<a style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</a>]
        </p>
      </div>
      <AuthButton disabled={buttonDisabled} label="회원가입" buttonRef={buttonRef} onClick={handleSubmit} />
    </div>
  );
};
export default AuthSignUpForm;
