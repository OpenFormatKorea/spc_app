import { NextApiRequest, NextApiResponse } from "next";
import { fromIni } from "@aws-sdk/credential-providers";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const isProduction = process.env.NODE_ENV === "production";
console.log("isProduction", isProduction);
let credentials;
if (isProduction) {
  credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  };
  console.log("isProduction  true credentials", credentials);
} else {
  credentials = fromIni({ profile: "dashboard" });
}

const region = process.env.NEXT_PUBLIC_AWS_REGION_NAME;
const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string;
const s3Client = new S3Client({ region, credentials });

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   const { key } = req.body;
//   const command = new PutObjectCommand({
//     Bucket: bucketName,
//     Key: key,
//   });

//   try {
//     const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 10 });
//     res.status(200).json({ uploadURL });
//   } catch (error) {
//     console.error("Error generating signed URL:", error);
//     res.status(500).json({ error: "Error generating signed URL" });
//   }
// }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Request body:", req.body); // Debug request payload
  const { key, action } = req.body;

  // if (!key || !action) {
  //   return res
  //     .status(400)
  //     .json({ error: "Missing required parameters: 'key' or 'action'" });
  // }
  // try {
  if (action === "upload") {
    const command = new PutObjectCommand({ Bucket: bucketName, Key: key });
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 180 });
    console.log("Generated upload URL:", uploadURL);
    return res.status(200).json({ uploadURL });
  } else if (action === "delete") {
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: key });
    await s3Client.send(command);
    return res
      .status(200)
      .json({ message: `File '${key}' deleted successfully` });
  } else {
    return res
      .status(400)
      .json({ error: "Invalid action. Use 'upload' or 'delete'." });
  }
  // } catch (error) {
  //   console.error("Error handling S3 operation:", error);
  //   return res.status(500).json({ error: "Error handling S3 operation" });
  // }
}
