import { LoginArgs, SignupArgs } from "@/pages/auth/lib/types";
import login from "@/pages/auth/login";
import axios from "axios";
import { useState } from "react";
import initMiddleware from "../lib/init-middleware";

//login
export async function fetchLogIn(info: LoginArgs) {
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}/account/login-merchant/`;
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
  } catch (error) {
    return { success: false, message: "이메일과 비밀번호를 확인 해 주세요" };
  }
}

//sign up
export async function fetchSignUp(info: SignupArgs) {
  console.log("info", info);
  const apiUrl = `${process.env.NEXT_PUBLIC_SERVER_API}account/register`;
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
