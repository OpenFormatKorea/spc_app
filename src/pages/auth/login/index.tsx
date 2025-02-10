import LoadingSpinner from "@/components/base/LoadingSpinner";
import AuthContainer from "@/components/layout/auth/AuthContainer";
import AuthLogin from "@/components/layout/auth/AuthLoginForm";
import { fetchLogIn } from "@/lib/auth/apis";
import { AuthArgs } from "@/lib/auth/types";
import {
  deleteCookies,
  setAccessTokenToCookies,
  setRefreshTokenToCookies,
  setShopIdTokenToCookies,
} from "@/lib/helper";
import { SHA256 } from "crypto-js";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useRef, useState, KeyboardEvent } from "react";

// src/pages/index.tsx
const Login = (context: GetServerSidePropsContext) => {
  const [loading, setLoading] = useState(false);
  const [showPW, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  const loginInfo: AuthArgs = {
    username: username,
    password: SHA256(password).toString(),
  };

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = event.currentTarget;
    if (id === "forgotpw") {
      router.push("/auth/forgotpw");
    } else if (id === "signup") {
      router.push("/auth/signup");
    }
  };

  const postLogin = async (info: AuthArgs) => {
    const result = await fetchLogIn(info);
    return result;
  };

  const infoCheck = (info: AuthArgs) => {
    if (!info.username) {
      alert("아이디를 확인 후 다시 시도해주세요.");
      return false;
    } else if (!info.password) {
      alert("비밀번호를 확인 후 다시 시도해주세요.");
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (!loading) {
      setLoading(true);
      if (infoCheck(loginInfo)) {
        try {
          const result = await postLogin(loginInfo);
          if (result.success) {
            deleteCookies();
            const {
              access = "",
              refresh = "",
              shop_id = "",
            } = result.data || {};
            await Promise.all([
              setAccessTokenToCookies(context, access),
              setRefreshTokenToCookies(context, refresh),
              setShopIdTokenToCookies(context, shop_id),
            ]);

            router.push("/dashboard");
          } else {
            console.log("login error: ", result.message);
            alert("로그인에 실패하였습니다.");
            setLoading(false);
          }
        } catch (e) {
          alert("로그인에 실패하였습니다.");
          console.error("error: ", e);
        }
      }
    }
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
          <LoadingSpinner />
        </div>
      )}
      <AuthContainer>
        <div className="flex h-screen items-center justify-center">
          <AuthLogin
            username={username}
            setUsername={setUsername}
            showPW={showPW}
            password={password}
            setPassword={setPassword}
            buttonDisabled={false}
            setShowPw={setShowPw}
            handleButton={handleButton}
            handleSubmit={handleSubmit}
            buttonRef={buttonRef}
            handleKeyDown={handleKeyDown}
          />
        </div>
      </AuthContainer>
    </>
  );
};

export default Login;
