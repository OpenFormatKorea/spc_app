import { AuthArgs, ChangePWArgs } from "@/lib/auth/types";
import { deleteCookies } from "@/lib/helper";
import axios from "axios";

//sign up
export async function fetchSignUp(info: AuthArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/register`;
  const username = info.username;
  const shop_name = info.shop_name;
  const email = info.email;
  const password = info.password;

  try {
    const {
      data: { access, refresh },
    }: { data: { access: string; refresh: string } } = await axios.post(apiUrl, {
      username,
      shop_name,
      email,
      password,
    });

    document.cookie = `access=${access};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    document.cookie = `refresh=${refresh};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    return { success: true, message: "회원가입 성공하였습니다." };
  } catch (error) {
    return { success: false, message: "아이디와 비밀번호를 확인 해 주세요" };
  }
}

//login
export async function fetchLogIn(info: AuthArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/login`;
  const { username, password } = info;

  deleteCookies();

  try {
    const response = await axios.post(apiUrl, { username, password });
    const { access, refresh, shop_id } = response.data;

    return {
      success: true,
      message: "로그인에 성공 하였습니다.",
      data: { access, refresh, shop_id },
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      message: "아이디와 비밀번호를 확인 해 주세요",
    };
  }
}

export async function fetchGenerateTempPW(info: AuthArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/generate-temp-password`;
  const username = info.username;
  const email = info.email;
  try {
    const response = await axios.post(apiUrl, { username, email });
    const { data, status } = response;
    return { success: true, message: `임시 비밀번호: ${data.temporary_password}`, status };
  } catch (error) {
    return { success: false, message: "이메일과 아이디를 확인 해 주세요", status };
  }
}

export async function fetchResetPW(info: AuthArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/reset_password/`;
  const username = info.username;
  const email = info.email;
  try {
    const response = await axios.post(apiUrl, { username, email });
    const { data, status } = response;
    return { success: true, message: `요청이 접수되었습니다. 아이디와 연결된 이메일을 확인해주세요`, status };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
    }
    return { success: false, message: "아이디를 확인 해 주세요", status };
  }
}

//change PW
export async function fetchChangePW(info: ChangePWArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/password_reset/confirm/`;
  const password = info.new_password;
  const token = info.token;

  try {
    const response = await axios.post(apiUrl, {
      password,
      token,
    });
    const { access, refresh } = response.data;
    document.cookie = `access=${access};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    document.cookie = `refresh=${refresh};path=/;domain=${
      process.env.NODE_ENV === "production" ? ".incento.kr" : "localhost"
    }`;
    return { success: true, message: "비밀번호 변경을 성공하였습니다." };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      if (status === 400) {
        let messages = data["password"] || [];
        for (let message of messages) {
          if (message === "This password is too common.") {
            return { success: false, message: "비밀번호가 너무 흔합니다. 다른 비밀번호를 사용해주세요" };
          }
          if (message === "The password is too similar to the username.") {
            return { success: false, message: "비밀번호가 아이디와 너무 유사합니다. 다른 비밀번호를 사용해주세요" };
          }
          if (message === "The password is too similar to the email.") {
            return { success: false, message: "비밀번호가 이메일과 너무 유사합니다. 다른 비밀번호를 사용해주세요" };
          }
          if (message === "The password is too similar to the email address.") {
            return { success: false, message: "비밀번호가 이메일과 너무 유사합니다. 다른 비밀번호를 사용해주세요" };
          }
        }
        return { success: false, message: "인센토 팀으로 문의를 남겨주세요" };
      }
      if (status === 404) {
        return { success: false, message: "비밀번호 재설정 링크가 만료되었습니다. 다시 시도해주세요" };
      }
    }
    return { success: false, message: "인센토 팀으로 문의를 남겨주세요" };
  }
}
