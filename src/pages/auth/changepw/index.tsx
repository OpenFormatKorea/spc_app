import { fetchChangePW, fetchSignUp } from "@/pages/auth/lib/apis";
import { ChangePWArgs } from "@/pages/auth/lib/types";
import router from "next/router";
import { useEffect, useState } from "react";
const changepw = () => {
  const [showPW, setShowPw] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [userName, setUsername] = useState("");
  const [old_password, setOldPW] = useState("");
  const [new_password, setNewPW] = useState("");
  const [newPasswordChk, setNewPasswordChk] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [instantPWChk, setInstantPWChk] = useState(false);
  const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;

  const changePWInfo: ChangePWArgs = {
    userName: userName,
    old_password: old_password,
    new_password: new_password,
  };

  const infoCheck = (info: ChangePWArgs) => {
    if (info.new_password !== newPasswordChk) {
      alert("Passwords do not match.");
      return false;
    } else if (!info.userName) {
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

  const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    router.push("/auth/forgotpw");
  };
  useEffect(() => {
    const isFormValid =
      userName !== "" && old_password !== "" && new_password !== "" && newPasswordChk !== "" && instantPWChk;
    setButtonDisabled(!isFormValid);
  }, [userName, old_password, new_password, newPasswordChk, instantPWChk]);

  return (
    <div
      className="ChangePWBox"
      style={{
        width: "full",
        backgroundColor: "#8ace00",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          className="min-w-[380px] w-[40vh] min-h-[380px] border-2 p-6"
          style={{
            backgroundColor: "#8ace00",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="text-xl m-2">새 비밀번호 변경하기</div>
          <div className="flex w-full m-2 p-1 justify-left align-left text-left items-center">
            <a className="w-[23%] m-2 h-17 text-xs">이메일: </a>
            <input
              type="text"
              id="userName"
              placeholder=" 아이디를 입력하세요."
              value={userName}
              className="usernameInput ml-2 text-xs p-2 w-[77%]"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex w-full m-2 p-1 justify-left align-left text-left items-center">
            <a className="w-[23%] m-2 h-17 text-xs">예전 비밀번호: </a>
            <input
              type="text"
              id="old_password"
              placeholder=" 임시 비밀번호를 입력하세요."
              value={old_password}
              className="oldpwInput ml-2 text-xs p-2 w-[77%]"
              onChange={(e) => setOldPW(e.target.value)}
            />
          </div>
          <div className="flex w-full m-2 p-1 justify-left align-left text-left items-center">
            <a className="w-[23%] m-2 h-17 text-xs">새 비밀번호: </a>
            <input
              type={showPW ? "text" : "password"}
              id="new_password"
              placeholder=" 새로 설정할 비밀번호를 입력하세요."
              value={new_password}
              className=" newpwInput ml-2 text-xs p-2 w-[77%]"
              onChange={handleNewPasswordChange}
            />
          </div>
          <div className="inblock w-full text-xs text-left mx-2">
            <p className="ml-2 h-17">
              * 비밀번호는 최소 8자, 대문자, 특수기호 포함 [
              <a style={passwordError === "사용 불가능" ? { color: "red" } : { color: "green" }}>{passwordError}</a>]
            </p>
          </div>
          <div className="flex w-full mx-2 mt-2 p-1 justify-left align-left text-left items-center">
            <a className="w-[23%] m-2 h-17 text-xs">
              새 비밀번호
              <br />
              체크:{" "}
            </a>
            <input
              type={showPW ? "text" : "password"}
              id="newPasswordChk"
              placeholder="비밀번호 확인"
              value={newPasswordChk}
              className="newpwChkInput ml-2 text-xs  p-2 w-[77%]"
              onChange={handleNewPasswordChkChange}
            />
          </div>
          <div className="inblock w-full text-xs text-right mx-2">
            <p className="mr-2 h-17">
              [<a style={{ color: instantPWChk ? "green" : "red" }}>{instantPWChk ? "일치" : "불일치"}</a>]
            </p>
          </div>
          <div className="m-2 w-full">
            <button
              disabled={buttonDisabled}
              className={`p-2 w-full text-center m-2 ${buttonDisabled ? " bg-gray-300 cursor-not-allowed" : " bg-black text-white"}`}
              onClick={handleSubmit}
            >
              비밀번호 변경
            </button>
          </div>
          <div className="passwordDiv flex w-full m-1 p-1 justify-center align-left text-left items-center">
            <div className="mr-2 ml-2 text-sm font-semibold cursor-pointer">
              <button id="login" onClick={handleButton}>
                임시 비밀번호 재발급
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default changepw;
