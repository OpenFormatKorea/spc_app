import AuthChangePWForm from "@/components/layout/auth/AuthChangePWForm";
import { fetchChangePW } from "@/lib/auth/apis";
import { ChangePWArgs } from "@/lib/auth/types";
import { SHA256 } from "crypto-js";
import { useRouter } from "next/router";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

const changepw = () => {
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [new_password, setNewPW] = useState("");
  const [newPasswordChk, setNewPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("사용불가능");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const { token } = router.query;

  const changePWInfo: ChangePWArgs = {
    new_password: SHA256(new_password).toString(),
    token: token as string,
  };

  const infoCheck = (info: ChangePWArgs) => {
    if (info.new_password !== newPasswordChk) {
      alert("Passwords do not match.");
      return false;
    } else if (!info.new_password) {
      alert("Check your new password.");
      return false;
    } else {
      return true;
    }
  };

  const checkPasswordsMatch = () => {
    return new_password === newPasswordChk;
  };

  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setNewPW(newPassword);
    setPasswordError(
      passwordPattern.test(e.target.value) ? "사용가능" : "사용불가능",
    );
    if (newPasswordChk) {
      setButtonDisabled(!checkPasswordsMatch());
    }
  };

  const handleNewPasswordChkChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const confirmPassword = e.target.value;
    setNewPasswordChk(confirmPassword);
    setInstantPWChk(new_password === confirmPassword);
    setButtonDisabled(!checkPasswordsMatch());
  };

  const postChangePW = async (info: ChangePWArgs) => {
    return await fetchChangePW(info);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent default form submission
    if (infoCheck(changePWInfo)) {
      const result = await postChangePW(changePWInfo);
      alert(result.message);
      if (result.success) {
        router.push("/auth/login");
      }
    } else {
      alert("비밀번호 변경에 실패하였습니다.");
      router.push("/auth/forgotpw");
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

  useEffect(() => {
    const isFormValid =
      new_password !== "" &&
      newPasswordChk !== "" &&
      passwordPattern.test(new_password);
    setInstantPWChk(new_password === newPasswordChk);
    setButtonDisabled(!isFormValid || !checkPasswordsMatch());
  }, [new_password, newPasswordChk]);

  return (
    <AuthChangePWForm
      showPW={showPW}
      new_password={new_password}
      buttonDisabled={buttonDisabled}
      handleNewPasswordChange={handleNewPasswordChange}
      passwordError={passwordError}
      newPasswordChk={newPasswordChk}
      instantPWChk={instantPWChk}
      handleNewPasswordChkChange={handleNewPasswordChkChange}
      setShowPw={setShowPw}
      handleSubmit={handleSubmit}
      buttonRef={buttonRef}
      handleKeyDown={handleKeyDown}
    ></AuthChangePWForm>
  );
};
export default changepw;
