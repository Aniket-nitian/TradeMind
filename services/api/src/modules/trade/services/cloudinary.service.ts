import cloudinary from "../../../config/cloudinary.js";
import streamifier from "streamifier";

export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    folder = "trademind/trades"
  ) {
    return new Promise<{
      url: string;
      publicId: string;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
        },
        (error, result) => {
          if (error) {
            console.log("=========== CLOUDINARY ERROR ===========");
            console.dir(error, { depth: null });
            console.log(JSON.stringify(error, null, 2));
            return reject(error);
          }

          console.log("=========== CLOUDINARY SUCCESS ===========");
          console.log(result);

          resolve({
            url: result!.secure_url,
            publicId: result!.public_id,
          });
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  }

  async deleteImage(publicId: string) {
    await cloudinary.uploader.destroy(publicId);
  }
}

export const cloudinaryService = new CloudinaryService();