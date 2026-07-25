import { Router } from "express";

import { calculatorController } from "../controllers/calculator.controller.js";

const router = Router();

router.post(
  "/position-size",
  calculatorController.positionSize.bind(
    calculatorController
  )
);

router.post(
  "/risk-reward",
  calculatorController.riskReward.bind(
    calculatorController
  )
);

router.post(
  "/stock-average",
  calculatorController.stockAverage.bind(
    calculatorController
  )
);

router.post(
  "/brokerage",
  calculatorController.brokerage.bind(
    calculatorController
  )
);

router.post(
  "/margin",
  calculatorController.margin.bind(
    calculatorController
  )
);

router.post(
  "/pivot-point",
  calculatorController.pivotPoint.bind(
    calculatorController
  )
);

router.post(
  "/fibonacci",
  calculatorController.fibonacci.bind(
    calculatorController
  )
);

router.post(
  "/cagr",
  calculatorController.cagr.bind(
    calculatorController
  )
);

router.post(
  "/lumpsum",
  calculatorController.lumpsum.bind(
    calculatorController
  )
);

router.post(
  "/sip",
  calculatorController.sip.bind(
    calculatorController
  )
);

router.post(
  "/goal",
  calculatorController.goal.bind(
    calculatorController
  )
);

export default router;