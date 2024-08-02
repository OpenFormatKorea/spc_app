import S3 from 'react-aws-s3-typescript';

const config = {
  bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
  // dirName: process.env. /* optional */,
  region: process.env.NEXT_PUBLIC_AWS_REGION_NAME as string,
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string,
  // s3Url:  process.env.NEXT_PUBLIC_AWS_S3_URL as string,
};

const ReactS3Client = new S3(config);
/*  Notice that if you don't provide a dirName, the file will be automatically uploaded to the root of your bucket */

/* This is optional */
// const newFileName = "test-file";

export default ReactS3Client;
