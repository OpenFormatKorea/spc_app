import AuthButton from "@/components/layout/authlayout/AuthButton";
import AuthContainer from "@/components/layout/authlayout/AuthContainer";
import AuthInputBox from "@/components/layout/authlayout/AuthInputBox";
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
}) => {
  return (
    <AuthContainer>
      <div className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6 bg-[#8ace00] flex flex-col justify-center items-center text-center">
        <div className="text-xl m-2">로그인</div>
        <AuthInputBox
          label="아이디:"
          type="text"
          id="username"
          placeholder="아이디을 입력하세요."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AuthInputBox
          label="비밀번호:"
          type={showPW ? "text" : "password"}
          id="password"
          placeholder="비밀번호를 입력하세요."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="text-xs border m-2 p-1 bg-white cursor-pointer" onClick={() => setShowPw(!showPW)}>
          비밀번호 {showPW ? "숨기기" : "보여주기"}
        </button>

        <AuthButton disabled={buttonDisabled} label="로그인" onClick={handleSubmit} />
        <div className="passwordDiv flex w-full m-1 p-1 justify-center items-center text-left">
          <div className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
            <button id="signup" onClick={handleButton}>
              회원가입
            </button>
          </div>
          <div>|</div>
          <div id="forgotpw" className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
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
