import AuthButton from "@/components/layout/auth/AuthButton";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { ChangeEvent } from "react";

interface AuthChangePWFormProps {
  showPW: boolean;
  setShowPw: (value: boolean) => void;
  new_password: string;
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
  showPW,
  new_password,
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
            <div>
              [<span style={passwordError === "사용 불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</span>]
            </div>
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
            <div>
              [<span style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</span>]
            </div>
          </div>
        </div>

        <AuthButton
          disabled={buttonDisabled}
          label="비밀번호 재설정하기"
          buttonRef={buttonRef}
          onClick={handleSubmit}
        />
      </div>
    </AuthContainer>
  );
};
export default AuthChangePWForm;
