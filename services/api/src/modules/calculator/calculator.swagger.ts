/**
 * @openapi
 * tags:
 *   - name: Calculator
 *     description: Trading and investment calculators (all stateless, no persistence)
 */

/**
 * @openapi
 * /calculator/position-size:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Position Size Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accountSize, riskPercent, entryPrice, stopLoss]
 *             properties:
 *               accountSize:
 *                 type: number
 *               riskPercent:
 *                 type: number
 *               entryPrice:
 *                 type: number
 *               stopLoss:
 *                 type: number
 *     responses:
 *       200:
 *         description: Position size calculated successfully.
 */

/**
 * @openapi
 * /calculator/risk-reward:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Risk/Reward Ratio Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [entryPrice, stopLoss, targetPrice]
 *             properties:
 *               entryPrice:
 *                 type: number
 *               stopLoss:
 *                 type: number
 *               targetPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Risk/reward ratio calculated successfully.
 */

/**
 * @openapi
 * /calculator/stock-average:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Stock Average (Cost Averaging) Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstQuantity, firstPrice, secondQuantity, secondPrice]
 *             properties:
 *               firstQuantity:
 *                 type: number
 *               firstPrice:
 *                 type: number
 *               secondQuantity:
 *                 type: number
 *               secondPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Average price calculated successfully.
 */

/**
 * @openapi
 * /calculator/brokerage:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Brokerage & Net P&L Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [buyPrice, sellPrice, quantity, brokeragePerOrder]
 *             properties:
 *               buyPrice:
 *                 type: number
 *               sellPrice:
 *                 type: number
 *               quantity:
 *                 type: number
 *               brokeragePerOrder:
 *                 type: number
 *     responses:
 *       200:
 *         description: Brokerage and net P&L calculated successfully.
 */

/**
 * @openapi
 * /calculator/margin:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Margin & Leverage Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [capital, leverage, entryPrice]
 *             properties:
 *               capital:
 *                 type: number
 *               leverage:
 *                 type: number
 *               entryPrice:
 *                 type: number
 *     responses:
 *       200:
 *         description: Margin calculated successfully.
 */

/**
 * @openapi
 * /calculator/pivot-point:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Pivot Point Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [high, low, close]
 *             properties:
 *               high:
 *                 type: number
 *               low:
 *                 type: number
 *               close:
 *                 type: number
 *     responses:
 *       200:
 *         description: Pivot points calculated successfully.
 */

/**
 * @openapi
 * /calculator/fibonacci:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Fibonacci Retracement Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [high, low]
 *             properties:
 *               high:
 *                 type: number
 *               low:
 *                 type: number
 *     responses:
 *       200:
 *         description: Fibonacci retracement levels calculated successfully.
 */

/**
 * @openapi
 * /calculator/cagr:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: CAGR Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [initialValue, finalValue, years]
 *             properties:
 *               initialValue:
 *                 type: number
 *               finalValue:
 *                 type: number
 *               years:
 *                 type: number
 *     responses:
 *       200:
 *         description: CAGR calculated successfully.
 */

/**
 * @openapi
 * /calculator/lumpsum:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Lumpsum Investment Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [principal, annualReturn, years]
 *             properties:
 *               principal:
 *                 type: number
 *               annualReturn:
 *                 type: number
 *               years:
 *                 type: number
 *     responses:
 *       200:
 *         description: Lumpsum returns calculated successfully.
 */

/**
 * @openapi
 * /calculator/sip:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: SIP Calculator
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [monthlyInvestment, annualReturn, years]
 *             properties:
 *               monthlyInvestment:
 *                 type: number
 *               annualReturn:
 *                 type: number
 *               years:
 *                 type: number
 *     responses:
 *       200:
 *         description: SIP returns calculated successfully.
 */

/**
 * @openapi
 * /calculator/goal:
 *   post:
 *     tags:
 *       - Calculator
 *     summary: Goal Planning Calculator
 *     description: Computes the monthly SIP required to reach a target amount.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [targetAmount, annualReturn, years]
 *             properties:
 *               targetAmount:
 *                 type: number
 *               annualReturn:
 *                 type: number
 *               years:
 *                 type: number
 *     responses:
 *       200:
 *         description: Required monthly investment calculated successfully.
 */