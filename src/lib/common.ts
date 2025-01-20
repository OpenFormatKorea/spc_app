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

export const S3AuthUpload = async (path: string, file: File) => {
  const response = await fetch("/api/s3-presigned-url.internal-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: path, fileType: "dummy", action: "upload" }),
  });
  console.log("S3Auth response", response);

  const { uploadURL } = await response.json();
  await fetch(uploadURL, {
    method: "PUT",
    body: file, // The actual File or Blob you want to upload
  });
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION_NAME}.amazonaws.com/${path}`;
  return url;
};

export const S3AuthDelete = async (path: string) => {
  const response = await fetch("/api/s3-presigned-url.internal-api", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key: path, action: "delete" }),
  });
  if (!response.ok) {
    throw new Error("Failed to delete file from S3");
  }

  // Step 2: Log success
  console.log(`File deleted successfully: ${path}`);
};
