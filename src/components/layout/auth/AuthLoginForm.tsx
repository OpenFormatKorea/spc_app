import AuthButton from "@/components/layout/auth/AuthButton";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthInputBox from "@/components/layout/auth/AuthInputBox";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
interface AuthLoginFormProps {
  username: string;
  setUsername: (value: string) => void;
  showPW: boolean;
  password: string;
  setPassword: (value: string) => void;
  buttonDisabled: boolean;
  setShowPw: (value: boolean) => void;
  handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const AuthLogin: React.FC<AuthLoginFormProps> = ({
  username,
  setUsername,
  showPW,
  password,
  setPassword,
  buttonDisabled,
  setShowPw,
  handleButton,
  handleSubmit,
  buttonRef,
  handleKeyDown,
}) => {
  return (
    <AuthContainer>
      <div className="flex min-h-[380px] min-w-[380px] flex-col items-center justify-center rounded-xl bg-gradient-to-b from-blue-200 to-blue-300 p-6 text-center">
        <div className="m-2 w-full text-left text-[18px] font-semibold">
          로그인
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
          <div className="flex w-full items-end justify-center">
            <AuthInputBox
              label="비밀번호"
              type={showPW ? "text" : "password"}
              id="password"
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="mb-[5px] ml-2 cursor-pointer border bg-white p-1 text-[12px]"
              onClick={() => setShowPw(!showPW)}
            >
              {showPW ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </button>
          </div>
        </div>
        <AuthButton
          disabled={buttonDisabled}
          label="로그인"
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
          <div id="forgotpw" className="ml-2 mr-2 cursor-pointer text-[14px]">
            <button id="forgotpw" onClick={handleButton}>
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>
    </AuthContainer>
  );
};
export default AuthLogin;
