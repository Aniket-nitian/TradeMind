/**
 * @openapi
 * tags:
 *   - name: Market
 *     description: Live index quotes for the market ticker
 */

/**
 * @openapi
 * /market/indices:
 *   get:
 *     tags:
 *       - Market
 *     summary: Get Tracked Indices
 *     description: Returns live quotes for the tracked NSE indices (Nifty 50, Nifty Next 50, Nifty Financial Services, Nifty Bank, Nifty 100).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Indices fetched (or empty array if the upstream quote source is temporarily unavailable).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       symbol:
 *                         type: string
 *                       name:
 *                         type: string
 *                       price:
 *                         type: number
 *                       change:
 *                         type: number
 *                       changePercent:
 *                         type: number
 *                       asOf:
 *                         type: string
 *                         format: date-time
 */
