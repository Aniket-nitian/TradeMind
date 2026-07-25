import { Router } from "express";
import { AiController } from "../controllers/ai.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";

const router = Router();
const controller = new AiController();

router.use(authGuard);

router.post("/conversations", controller.createConversation);
router.get("/conversations", controller.listConversations);
router.get("/conversations/:id", controller.getConversation);
router.post("/conversations/:id/messages", controller.addMessage);
router.delete("/conversations/:id", controller.deleteConversation);

router.get("/messages/recent", controller.getRecentMessages);

router.get("/memory", controller.getMemory);
router.put("/memory", controller.upsertMemory);

export default router;
