import { Router } from "express";
import multer from "multer";
import { CsvController } from "../controllers/csv.controller.js";
import { authGuard } from "../../auth/guards/auth.guard.js";
import { AppError } from "../../../shared/exceptions/AppError.js";

const router = Router();
const controller = new CsvController();

const ALLOWED_EXTENSIONS = [".csv", ".xlsx"];

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB
    },
    fileFilter: (_req, file, callback) => {
        const hasAllowedExtension = ALLOWED_EXTENSIONS.some((ext) =>
            file.originalname.toLowerCase().endsWith(ext)
        );

        if (!hasAllowedExtension) {
            callback(
                new AppError(
                    "Unsupported file type — please upload a .csv or .xlsx file.",
                    400
                )
            );
            return;
        }

        callback(null, true);
    },
});

router.post(
    "/upload",
    authGuard,
    upload.single("file"),
    controller.upload
);

router.post(
    "/:importId/confirm",
    authGuard,
    controller.confirm
);

router.get(
    "/history",
    authGuard,
    controller.history
);

router.get(
    "/history/:importId",
    authGuard,
    controller.getImport
);

export default router;