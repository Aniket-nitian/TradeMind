import { ImageType } from "../../../generated/prisma/enums.js";



import { tradeRepository } from "../repositories/trade.repository.js";
import { tradeImageRepository } from "../repositories/trade-image.repository.js";
import { AppError } from "../../../shared/exceptions/AppError.js";
import { cloudinaryService } from "./cloudinary.service.js";



class TradeImageService {
  async upload(
    userId: string,
    tradeId: string,
    file: Express.Multer.File,
    type: ImageType = ImageType.CHART
  ) {
    const trade = await tradeRepository.findById(tradeId, userId);

    if (!trade) {
      throw new AppError("Trade not found", 404);
    }

    const uploaded = await cloudinaryService.uploadImage(file);

    return tradeImageRepository.create({
      tradeId,
      imageUrl: uploaded.url,
      publicId: uploaded.publicId,
      type,
    });
  }

  async getAll(userId: string, tradeId: string) {
    const trade = await tradeRepository.findById(tradeId, userId);

    if (!trade) {
      throw new AppError("Trade not found", 404);
    }

    return tradeImageRepository.findManyByTrade(tradeId);
  }

  async delete(userId: string, imageId: string) {
    const image = await tradeImageRepository.findById(imageId);

    if (!image) {
      throw new AppError("Image not found", 404);
    }

    const trade = await tradeRepository.findById(image.tradeId, userId);

    if (!trade) {
      throw new AppError("Unauthorized", 403);
    }

    if (image.publicId) {
      await cloudinaryService.deleteImage(image.publicId);
    }

    await tradeImageRepository.softDelete(imageId);

    return {
      success: true,
      message: "Image deleted successfully",
    };
  }
}

export const tradeImageService = new TradeImageService();