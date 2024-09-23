import { getShopIdFromCookies } from "@/lib/helper";
import { GetServerSidePropsContext } from "next";
import ReactS3Client from "@/lib/aws/ReactS3Client";

const UploadImage =
  // (file: File, campaign_id: string, imgType: string) =>
  async (file: File, campaign_id: string, imgType: string, context: GetServerSidePropsContext): Promise<any> => {
    const fileFormat = file.name.split(".").reverse()[0];
    const shop_id = getShopIdFromCookies(context);
    const path = "/standalone/DEV/" + shop_id + "/" + campaign_id + "/" + "kakao/image/" + imgType + "/" + fileFormat;

    try {
      // Upload file to S3
      const response = await ReactS3Client.uploadFile(file, path);
      return response.location; // URL of the uploaded file
    } catch (error) {
      console.error("Image upload failed:", error);
      throw error;
    }
  };
export default UploadImage;
