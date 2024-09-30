import AuthChangePWForm from "@/components/layout/auth/AuthChangePWForm";
import { authenticateUser } from "@/lib/auth";
import { fetchChangePW } from "@/lib/auth/apis";
import { ChangePWArgs } from "@/lib/auth/types";
import { GetServerSideProps } from "next";
import router from "next/router";
import { useEffect, useRef, useState, KeyboardEvent } from "react";
export const getServerSideProps: GetServerSideProps = async (context) => {
  return authenticateUser(context, "/auth/login");
};
const changepw = () => {
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [username, setUsername] = useState("");
  const [old_password, setOldPW] = useState("");
  const [new_password, setNewPW] = useState("");
  const [newPasswordChk, setNewPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
  const buttonRef = useRef<HTMLButtonElement>(null);

  const changePWInfo: ChangePWArgs = {
    username: username,
    old_password: old_password,
    new_password: new_password,
  };

  const infoCheck = (info: ChangePWArgs) => {
    if (info.new_password !== newPasswordChk) {
      alert("Passwords do not match.");
      return false;
    } else if (!info.username) {
      alert("Check your username.");
      return false;
    } else if (!info.old_password) {
      alert("Check your temporary password.");
      return false;
    } else if (!info.new_password) {
      alert("Check your new password.");
      return false;
    } else {
      return true;
    }
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPW(e.target.value);

    if (!passwordPattern.test(e.target.value)) {
      setPasswordError("사용 불가능");
    } else {
      setPasswordError("사용 가능");
    }
  };

  const handleNewPasswordChkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPasswordChk(e.target.value);
    if (e.target.value !== new_password) {
      setInstantPWChk(false);
    } else {
      setInstantPWChk(true);
    }
  };

  const postChangePW = async (info: ChangePWArgs) => {
    const result = await fetchChangePW(info);
    return result;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    if (infoCheck(changePWInfo)) {
      const result = await postChangePW(changePWInfo);
      alert(result.message);
      if (result.success) {
        router.push("/auth/login");
      }
    } else {
      alert("비밀번호 변경에 실패하였습니다.");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (buttonRef.current) {
        buttonRef.current.click();
      }
    }
  };

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    router.push("/auth/forgotpw");
  };

  useEffect(() => {
    const isFormValid =
      username !== "" && old_password !== "" && new_password !== "" && newPasswordChk !== "" && instantPWChk;
    setButtonDisabled(!isFormValid);
  }, [username, old_password, new_password, newPasswordChk, instantPWChk]);

  return (
    <AuthChangePWForm
      username={username}
      setUsername={setUsername}
      showPW={showPW}
      old_password={old_password}
      new_password={new_password}
      setOldPW={setOldPW}
      buttonDisabled={buttonDisabled}
      handleNewPasswordChange={handleNewPasswordChange}
      passwordError={passwordError}
      newPasswordChk={newPasswordChk}
      instantPWChk={instantPWChk}
      handleNewPasswordChkChange={handleNewPasswordChkChange}
      setShowPw={setShowPw}
      handleButton={handleButton}
      handleSubmit={handleSubmit}
      buttonRef={buttonRef}
      handleKeyDown={handleKeyDown}
    ></AuthChangePWForm>
  );
};
export default changepw;
