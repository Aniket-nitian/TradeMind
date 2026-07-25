import { Router } from "express";

import { authGuard } from "../../auth/guards/auth.guard.js";
import { strategyController } from "../controllers/strategy.controller.js";

const router = Router();

router.use(authGuard);

router.post("/", strategyController.create.bind(strategyController));

router.get("/", strategyController.getAll.bind(strategyController));

router.get("/:id", strategyController.getById.bind(strategyController));

router.put("/:id", strategyController.update.bind(strategyController));

router.delete("/:id", strategyController.delete.bind(strategyController));

export default router;