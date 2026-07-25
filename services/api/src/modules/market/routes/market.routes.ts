import { Router } from "express";

import { authGuard } from "../../auth/guards/auth.guard.js";
import { getIndices } from "../controllers/market.controller.js";

const router = Router();

router.use(authGuard);

router.get("/indices", getIndices);

export default router;
