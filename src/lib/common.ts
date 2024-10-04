import { getCookie, deleteCookie } from "cookies-next";
import router from "next/router";

export const handleSignOut = async (event?: React.FormEvent) => {
  if (event) event.preventDefault();

  const access = getCookie("access_standalone");
  if (access) {
    deleteCookies();
    router.push("/home");
  } else {
    alert("로그아웃을 실패하였습니다. 잠시 후 다시 시도해주시기 바랍니다.");
  }
};

export const deleteCookies = () => {
  deleteCookie("access_standalone");
  deleteCookie("refresh_standalone");
  deleteCookie("shop_id_standalone");
};

export const handleLogo = () => {
  router.push("/dashboard");
};

export const showShopID = () => {
  router.push("/dashboard");
};
