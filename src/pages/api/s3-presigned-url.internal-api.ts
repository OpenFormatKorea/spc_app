import { NextApiRequest, NextApiResponse } from "next";
import { fromIni } from "@aws-sdk/credential-providers";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const isProduction = process.env.NODE_ENV === "production";
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
let credentials;
if (isProduction) {
  console.log("isproduction YES YES");

  credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  };
  console.log("credentials", credentials);
} else {
  console.log("isproduction NO NO");

  // you muse have 'dashboard' aws profile locally
  credentials = fromIni({ profile: "dashboard" });
}

const region = process.env.NEXT_PUBLIC_AWS_REGION_NAME;
const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;
const s3Client = new S3Client({ region, credentials });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { key } = req.body;
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 10 });
    console.log("req.body", req.body);
    console.log("res", res.status, res);
    res.status(200).json({ uploadURL });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Error generating signed URL" });
  }
}