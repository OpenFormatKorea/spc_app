import { deleteCookies } from "@/lib/helper";
import { getCookie } from "cookies-next";
import router from "next/router";

export const handleSignOut = async (event?: React.FormEvent) => {
  if (event) event.preventDefault();

  const access = getCookie("access_standalone");
  if (access) {
    deleteCookies();
    router.push("/home");
  } else {
    alert("로그아웃을 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.");
    deleteCookies();
    router.push("/auth/login");
  }
};

export const handleLogo = () => {
  router.push("/dashboard");
};

export function hasWhiteSpace(s: string) {
  return /\s/g.test(s);
}

export function removeWhiteSpace(s: string) {
  return s.replace(/\s/g, "");
}
