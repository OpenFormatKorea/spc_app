import { AuthArgs, ChangePWArgs } from "@/pages/auth/lib/types";
import axios from "axios";

//sign up
export async function fetchSignUp(info: AuthArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/register`;
  const username = info.userName;
  const password = info.password;
  const email = info.email;

  try {
    const {
      data: { access, refresh },
    }: { data: { access: string; refresh: string } } = await axios.post(apiUrl, { username, password, email });

    document.cookie = `access=${access};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    document.cookie = `refresh=${refresh};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    console.log("success: ", true, "message: Signup successful");
    return { success: true, message: "Signup successful" };
  } catch (error) {
    console.log("success: ", false, "message: 이메일과 비밀번호를 확인 해 주세요");

    return { success: false, message: "이메일과 비밀번호를 확인 해 주세요" };
  }
}

//login
export async function fetchLogIn(info: AuthArgs) {
  console.log("info", info);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/login`;
  const username = info.userName;
  const password = info.password;
  try {
    const {
      data: { access, refresh },
    }: { data: { access: string; refresh: string } } = await axios.post(apiUrl, { username, password });

    document.cookie = `access=${access};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    document.cookie = `refresh=${refresh};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    console.log("success: ", true, "message: 로그인에 성공 하였습니다.");
    return { success: true, message: "로그인에 성공 하였습니다." };
  } catch (error) {
    console.log("success: ", false, "message: 이메일과 비밀번호를 확인 해 주세요");
    return { success: false, message: "이메일과 비밀번호를 확인 해 주세요" };
  }
}

//reset PW
export async function fetchResetPW(info: AuthArgs) {
  console.log("info", info);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/generate-temp-password`;
  const username = info.userName;
  const email = info.email;
  try {
    const {
      data: { access, refresh },
    }: { data: { access: string; refresh: string } } = await axios.post(apiUrl, { username, email });

    document.cookie = `access=${access};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    document.cookie = `refresh=${refresh};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    console.log("success: ", true, "");
    return { success: true, message: "임시 비밀번호 발급을 성공하였습니다." };
  } catch (error) {
    console.log("success: ", false, "message: 이메일과 아이디를 확인 해 주세요");
    return { success: false, message: "이메일과 아이디를 확인 해 주세요" };
  }
}

//change PW
export async function fetchChangePW(info: ChangePWArgs) {
  console.log("info", info);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/generate-temp-password`;
  const userName = info.userName;
  const old_password = info.old_password;
  const new_password = info.new_password;
  try {
    const {
      data: { access, refresh },
    }: { data: { access: string; refresh: string } } = await axios.post(apiUrl, {
      userName,
      old_password,
      new_password,
    });

    document.cookie = `access=${access};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    document.cookie = `refresh=${refresh};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    console.log("success: ", true, "");
    return { success: true, message: "비밀번호 변경을 성공하였습니다." };
  } catch (error) {
    console.log("success: ", false, "message: 비밀번호 변경 실패 ");
    return { success: false, message: "비밀번호 변경 정보를 확인 해 주세요" };
  }
}
