import AuthChangePWForm from "@/components/layout/auth/AuthChangePWForm";
import {authenticateUser} from "@/lib/auth";
import {fetchChangePW} from "@/lib/auth/apis";
import {ChangePWArgs} from "@/lib/auth/types";
import {GetServerSideProps} from "next";
import {useRouter} from "next/router";
import {KeyboardEvent, useEffect, useRef, useState} from "react";

export const getServerSideProps: GetServerSideProps = async (context) => {
    return authenticateUser(context, "/auth/login");
};
const changepw = () => {
    const [showPW, setShowPw] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [new_password, setNewPW] = useState("");
    const [newPasswordChk, setNewPasswordChk] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [instantPWChk, setInstantPWChk] = useState(false);
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,12}$/;
    const buttonRef = useRef<HTMLButtonElement>(null);
    const router = useRouter();
    // get token from url path (i.e. auth/changepw/[token])
    const {token} = router.query;

    const changePWInfo: ChangePWArgs = {
        new_password: new_password,
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
        return await fetchChangePW(info);
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
            new_password !== "" && newPasswordChk !== "" && instantPWChk;
        setButtonDisabled(!isFormValid);
    }, [new_password, newPasswordChk, instantPWChk]);

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
            handleButton={handleButton}
            handleSubmit={handleSubmit}
            buttonRef={buttonRef}
            handleKeyDown={handleKeyDown}
        ></AuthChangePWForm>
    );
};
export default changepw;
