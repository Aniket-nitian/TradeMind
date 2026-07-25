import { Router } from "express";

import { authGuard } from "../../auth/guards/auth.guard.js";

import { tradeController } from "../controllers/trade.controller.js";
import { tradeImageController } from "../controllers/trade-image.controller.js";

import { upload } from "../../../shared/upload/multer.js";

const router = Router();

router.use(authGuard);

router.post("/", tradeController.create.bind(tradeController));

router.get("/", tradeController.getAll.bind(tradeController));

router.get("/search", tradeController.search.bind(tradeController));

router.get(
  "/:id/details",
  tradeController.getTradeDetails.bind(tradeController)
);

router.get(
  "/embeddings/pending",
  tradeController.getPendingEmbeddings.bind(tradeController)
);

router.get(
  "/embeddings",
  tradeController.getEmbeddedTrades.bind(tradeController)
);

router.post(
  "/:id/embedding",
  tradeController.saveEmbedding.bind(tradeController)
);

router.post(
  "/:id/checklist",
  tradeController.createChecklistItem.bind(tradeController)
);

router.get(
  "/:id/checklist",
  tradeController.getChecklist.bind(tradeController)
);

router.patch(
  "/checklist/:id",
  tradeController.updateChecklistItem.bind(tradeController)
);

router.delete(
  "/checklist/:id",
  tradeController.deleteChecklistItem.bind(tradeController)
);

router.patch(
  "/:id/emotions",
  tradeController.updateEmotions.bind(tradeController)
);

router.get(
  "/:id/emotions",
  tradeController.getEmotions.bind(tradeController)
);

router.get("/:id", tradeController.getById.bind(tradeController));

router.put("/:id", tradeController.update.bind(tradeController));

router.delete("/:id", tradeController.delete.bind(tradeController));

router.post(
  "/:tradeId/images",
  upload.single("image"),
  tradeImageController.upload.bind(tradeImageController)
);

router.get(
  "/:tradeId/images",
  tradeImageController.getAll.bind(tradeImageController)
);

router.delete(
  "/images/:imageId",
  tradeImageController.delete.bind(tradeImageController)
);

router.patch(
  "/:id/journal",
  authGuard,
  tradeController.updateJournal.bind(tradeController)
);

router.get(
  "/:id/journal",
  authGuard,
  tradeController.getJournal.bind(tradeController)
);

export default router;