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
      <div className="min-w-[380px] min-h-[380px] rounded-xl p-6 bg-blue-200 flex flex-col justify-center items-center text-center">
        <div className="text-xl font-semibold m-2 w-full text-left">로그인</div>
        <div className="flex flex-col w-full items-start justify-between">
          <AuthInputBox
            label="아이디"
            type="text"
            id="username"
            placeholder="아이디를 입력하세요."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-end justify-center w-full">
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
              className="text-xs border bg-white p-1 ml-2 mb-[5px] cursor-pointer"
              onClick={() => setShowPw(!showPW)}
            >
              {showPW ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
            </button>
          </div>
        </div>
        <AuthButton disabled={buttonDisabled} label="로그인" buttonRef={buttonRef} onClick={handleSubmit} />
        <div className="passwordDiv flex w-full m-1 p-1 justify-center items-center text-left">
          <div className="mr-2 ml-2 text-sm cursor-pointer">
            <button id="signup" onClick={handleButton}>
              회원가입
            </button>
          </div>
          <div>|</div>
          <div id="forgotpw" className="mr-2 ml-2 text-sm cursor-pointer">
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
