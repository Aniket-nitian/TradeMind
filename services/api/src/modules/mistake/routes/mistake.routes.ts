import { Router } from "express";

import { authGuard } from "../../auth/guards/auth.guard.js";
import { mistakeController } from "../controllers/mistake.controller.js";

const router = Router();

router.use(authGuard);

router.post(
  "/",
  mistakeController.create.bind(mistakeController)
);

router.get(
  "/",
  mistakeController.getAll.bind(mistakeController)
);

router.get(
  "/:id",
  mistakeController.getById.bind(mistakeController)
);

router.put(
  "/:id",
  mistakeController.update.bind(mistakeController)
);

router.delete(
  "/:id",
  mistakeController.delete.bind(mistakeController)
);

router.post(
  "/trades/:tradeId/:mistakeId",
  mistakeController.attachMistake.bind(mistakeController)
);

router.delete(
  "/trades/:tradeId/:mistakeId",
  mistakeController.removeMistake.bind(mistakeController)
);

router.get(
  "/trades/:tradeId",
  mistakeController.getTradeMistakes.bind(mistakeController)
);

export default router;