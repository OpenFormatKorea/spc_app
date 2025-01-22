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
    body: JSON.stringify({ key: path, action: "upload" }),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Log raw error
    console.error("Failed to fetch presigned URL:", errorText);
    throw new Error(`Failed to fetch presigned URL: ${response.status}`);
  }

  const { uploadURL } = await response.json();

  const uploadResponse = await fetch(uploadURL, {
    method: "PUT",
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Failed to upload file to S3: ${uploadResponse.status}`);
  }

  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION_NAME}.amazonaws.com/${path}`;
  return url;
};

export const S3AuthDelete = async (path: string) => {
  try {
    const response = await fetch("/api/s3-presigned-url.internal-api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key: path, action: "delete" }),
    });
    console.log("S3AuthDelete response", response);
    if (!response.ok) {
      const errorText = await response.text(); // Log raw error
      console.error("Failed to Delete:", errorText);
      throw new Error(`Failed to Delete: ${response.status}`);
    }
  } catch (e) {
    console.error("error: ", e);
  }
};
