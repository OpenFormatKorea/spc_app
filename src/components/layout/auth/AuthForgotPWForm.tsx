import AuthButton from "@/components/layout/auth/AuthButton";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
import AuthLogin from "@/components/layout/auth/AuthLoginForm";
interface AuthForgotPWProps {
  username: string;
  setUsername: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  buttonDisabled: boolean;
  handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const AuthForgotPW: React.FC<AuthForgotPWProps> = ({
  username,
  setUsername,
  email,
  setEmail,
  handleButton,
  handleSubmit,
  buttonDisabled,
  buttonRef,
  handleKeyDown,
}) => {
  return (
    <AuthContainer>
      <div className="min-w-[380px] min-h-[380px] rounded-xl p-6 bg-blue-200 flex flex-col justify-center  items-center text-center">
        <div className="text-xl font-semibold m-2 w-full text-left">비밀번호 찾기</div>
        <div className="flex flex-col w-full items-start justify-between">
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
            label="아이디:"
            type="text"
            id="username"
            placeholder="아이디를 입력하세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <AuthButton disabled={buttonDisabled} label="임시 비밀번호 발급" buttonRef={buttonRef} onClick={handleSubmit} />
        <div className="passwordDiv flex w-full m-1 p-1 justify-center items-center text-left">
          <div className="mr-2 ml-2 text-sm cursor-pointer">
            <button id="signup" onClick={handleButton}>
              회원가입
            </button>
          </div>
          <div>|</div>
          <div className="mr-2 ml-2 text-sm cursor-pointer">
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
