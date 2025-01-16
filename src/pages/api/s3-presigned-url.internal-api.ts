import { NextApiRequest, NextApiResponse } from "next";
import { fromIni } from "@aws-sdk/credential-providers";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const isProduction = process.env.NODE_ENV === "production";
let credentials;
if (isProduction) {
  credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  };
  console.log("credentials", credentials);
} else {
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
    res.status(200).json({ uploadURL });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).json({ error: "Error generating signed URL" });
  }
}
