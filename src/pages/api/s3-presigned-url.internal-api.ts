import { NextApiRequest, NextApiResponse } from "next";
import { fromIni } from "@aws-sdk/credential-providers";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
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
  const { key, action } = req.body; // Expecting `key` (file path) and `action` ('upload' or 'delete')

  if (!key || !action) {
    return res
      .status(400)
      .json({ error: "Missing required parameters: 'key' or 'action'" });
  }
  // try {
  if (action === "upload") {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    console.log("upload command,", command);

    const uploadURL = await getSignedUrl(s3Client, command, {
      expiresIn: 10,
    });
    console.log("upload uploadURL,", uploadURL);

    res.status(200).json({ uploadURL });
  } else if (action === "delete") {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });
    console.log("delete command,", command);

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
