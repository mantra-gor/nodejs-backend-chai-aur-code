import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      return null;
    }

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log(response);

    // Now Remove the file from our server
    fs.unlinkSync(localFilePath);

    // File uploaded successfully
    console.log("file is uploaded successfully", response.url);
    return response;
  } catch (error) {
    // Remove the locally saved temporary file as the upload
    fs.unlinkSync(localFilePath);
  }
};

export { uploadOnCloudinary };
