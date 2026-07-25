import { Router } from "express";

import { authGuard } from "../../auth/guards/auth.guard.js";
import { tagController } from "../controllers/tag.controller.js";

const router = Router();

router.use(authGuard);

router.post(
  "/",
  tagController.create.bind(tagController)
);

router.get(
  "/",
  tagController.getAll.bind(tagController)
);

router.get(
  "/:id",
  tagController.getById.bind(tagController)
);

router.put(
  "/:id",
  tagController.update.bind(tagController)
);

router.delete(
  "/:id",
  tagController.delete.bind(tagController)
);

router.post(
  "/trades/:tradeId/:tagId",
  tagController.attachTag.bind(tagController)
);

router.delete(
  "/trades/:tradeId/:tagId",
  tagController.removeTag.bind(tagController)
);

router.get(
  "/trades/:tradeId",
  tagController.getTradeTags.bind(tagController)
);

export default router;