import S3 from "react-aws-s3-typescript";

const S3config = {
  bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
  region: process.env.NEXT_PUBLIC_AWS_REGION_NAME as string,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string,
};

const ReactS3Client = new S3(S3config);

export default ReactS3Client;
