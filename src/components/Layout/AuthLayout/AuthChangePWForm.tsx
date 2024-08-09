import AuthButton from "@/components/layout/authlayout/AuthButton";
import AuthContainer from "@/components/layout/authlayout/AuthContainer";
import AuthInputBox from "@/components/layout/authlayout/AuthInputBox";
import { ChangeEvent } from "react";
interface AuthChangePWFormProps {
  username: string;
  setUsername: (value: string) => void;
  showPW: boolean;
  setShowPw: (value: boolean) => void;
  old_password: string;
  new_password: string;
  setOldPW: (value: string) => void;
  instantPWChk: boolean;
  buttonDisabled: boolean;
  handleNewPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNewPasswordChkChange: (e: ChangeEvent<HTMLInputElement>) => void;
  passwordError: string;
  newPasswordChk: string;
  handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const AuthChangePWForm: React.FC<AuthChangePWFormProps> = ({
  username,
  setUsername,
  showPW,
  old_password,
  new_password,
  setOldPW,
  buttonDisabled,
  passwordError,
  newPasswordChk,
  instantPWChk,
  handleNewPasswordChange,
  handleNewPasswordChkChange,
  setShowPw,
  handleButton,
  handleSubmit,
  buttonRef,
  handleKeyDown,
}) => {
  return (
    <AuthContainer>
      <div className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6 bg-[#8ace00] flex flex-col justify-center items-center text-center">
        <div className="text-xl m-2">비밀번호 변경</div>
        <AuthInputBox
          label="아이디:"
          type="text"
          id="username"
          placeholder="아이디을 입력하세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <AuthInputBox
          label="임시 비밀번호:"
          type={showPW ? "text" : "password"}
          id="old_password"
          placeholder="임시 비밀번호를 입력하세요."
          value={old_password}
          onChange={(e) => setOldPW(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <AuthInputBox
          label="신규 비밀번호:"
          type={showPW ? "text" : "password"}
          id="new_password"
          placeholder="신규 비밀번호를 입력하세요."
          value={new_password}
          onChange={handleNewPasswordChange}
          onKeyDown={handleKeyDown}
        />
        <div className="inline-block w-full text-xs text-left mx-2">
          <p className="ml-2">
            * 비밀번호는 최소 8자, 대문자, 특수기호 포함 [
            <a style={passwordError === "사용 불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</a>]
          </p>
        </div>
        <AuthInputBox
          label="신규 비밀번호 확인:"
          type={showPW ? "text" : "password"}
          id="newPasswordChk"
          placeholder="비밀번호 확인"
          value={newPasswordChk}
          onChange={handleNewPasswordChkChange}
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

        <AuthButton
          disabled={buttonDisabled}
          label="임시 비밀번호 재발급"
          buttonRef={buttonRef}
          onClick={handleSubmit}
        />
        <div className="passwordDiv flex w-full m-1 p-1 justify-center items-center text-left">
          <div id="forgotpw" className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
            <button id="forgotpw" onClick={handleButton}>
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};
export default AuthChangePWForm;
