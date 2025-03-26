import AuthButton from "@/components/layout/auth/AuthButton";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
interface AuthForgotPWProps {
  username: string;
  setUsername: (value: string) => void;
  buttonDisabled: boolean;
  handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const AuthForgotPW: React.FC<AuthForgotPWProps> = ({
  username,
  setUsername,
  handleButton,
  handleSubmit,
  buttonDisabled,
  buttonRef,
  handleKeyDown,
}) => {
  return (
    <AuthContainer>
      <div className="flex min-h-[320px] min-w-[380px] flex-col items-center justify-center rounded-xl bg-gradient-to-b from-blue-200 to-blue-300 p-6 text-center">
        <div className="m-2 w-full text-left text-[18px] font-semibold">
          비밀번호 찾기
        </div>
        <div className="flex w-full flex-col items-start justify-between">
          <AuthInputBox
            label="아이디"
            type="text"
            id="username"
            placeholder="아이디를 입력하세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <AuthButton
          disabled={buttonDisabled}
          label="비밀번호 재설정하기"
          buttonRef={buttonRef}
          onClick={handleSubmit}
        />
        <div className="passwordDiv m-1 flex w-full items-center justify-center p-1 text-left">
          <div className="ml-2 mr-2 cursor-pointer text-[14px]">
            <button id="signup" onClick={handleButton}>
              회원가입
            </button>
          </div>
          <div>|</div>
          <div className="ml-2 mr-2 cursor-pointer text-[14px]">
            <button id="login" onClick={handleButton}>
              로그인
            </button>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};
export default AuthForgotPW;
