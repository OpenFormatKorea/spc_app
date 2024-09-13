import AuthButton from "@/components/layout/auth/AuthButton";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
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
      <div className="min-w-[380px] min-h-[380px] rounded-xl p-6 bg-gradient-to-b from-blue-200 to-blue-300 flex flex-col justify-center items-center text-center">
        <div className="text-xl font-semibold m-2 w-full text-left">비밀번호 변경</div>
        <div className="flex flex-col w-full items-start justify-between">
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
          <div className="flex justify-between w-full text-xs text-left mt-2">
            <p className="text-gray-500">*비밀번호는 최소 8자, 대문자, 특수기호 포함</p>
            <a>
              [<a style={passwordError === "사용 불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</a>]
            </a>
          </div>
          <div className="flex justify-between w-full items-end text-left">
            <AuthInputBox
              label="신규 비밀번호 확인:"
              type={showPW ? "text" : "password"}
              id="newPasswordChk"
              placeholder="비밀번호 확인"
              value={newPasswordChk}
              onChange={handleNewPasswordChkChange}
              onKeyDown={handleKeyDown}
            />
            <div className="inline-block  text-xs text-right ml-2">
              <button
                className="text-xs border bg-white p-1 mb-[5px] cursor-pointer"
                onClick={() => setShowPw(!showPW)}
              >
                {showPW ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </button>
            </div>
          </div>
          <div className="w-full text-xs text-right pt-2">
            <p>
              [<a style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</a>]
            </p>
          </div>
        </div>

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
