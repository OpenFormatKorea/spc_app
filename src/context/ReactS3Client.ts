import S3 from "react-aws-s3-typescript";

const config = {
  bucketName: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME as string,
  region: process.env.NEXT_PUBLIC_AWS_REGION_NAME as string, // Should be 'ap-northeast-2'
  accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY as string,
  secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY as string,
  s3Url: `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION_NAME}.amazonaws.com`,
};

const ReactS3Client = new S3(config);

export default ReactS3Client;
