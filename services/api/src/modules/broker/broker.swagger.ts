/**
 * @openapi
 * tags:
 *   - name: Broker
 *     description: Broker account connections and live trade sync (Premium)
 */

/**
 * @openapi
 * /broker/connect:
 *   post:
 *     tags:
 *       - Broker
 *     summary: Connect Broker Account
 *     description: Connects a broker account using broker-specific credentials. Requires an active Premium subscription.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - broker
 *             properties:
 *               broker:
 *                 type: string
 *                 enum: [ZERODHA, ANGEL_ONE, UPSTOX, GROWW, DHAN, FYERS, ICICI_DIRECT]
 *     responses:
 *       200:
 *         description: Broker account connected successfully.
 *       403:
 *         description: Premium subscription required.
 */

/**
 * @openapi
 * /broker:
 *   get:
 *     tags:
 *       - Broker
 *     summary: List Connected Broker Accounts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Connected broker accounts fetched.
 */

/**
 * @openapi
 * /broker/{broker}:
 *   delete:
 *     tags:
 *       - Broker
 *     summary: Disconnect Broker Account
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: broker
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ZERODHA, ANGEL_ONE, UPSTOX, GROWW, DHAN, FYERS, ICICI_DIRECT]
 *     responses:
 *       200:
 *         description: Broker account disconnected.
 */

/**
 * @openapi
 * /broker/{broker}/sync:
 *   post:
 *     tags:
 *       - Broker
 *     summary: Sync Trades
 *     description: Fetches fills since the last sync, matches them into round-trip trades via FIFO, and imports them. Requires an active Premium subscription. Also runs automatically every 6 hours for connected Premium accounts.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: broker
 *         required: true
 *         schema:
 *           type: string
 *           enum: [ZERODHA, ANGEL_ONE, UPSTOX, GROWW, DHAN, FYERS, ICICI_DIRECT]
 *     responses:
 *       200:
 *         description: Broker sync completed.
 *       403:
 *         description: Premium subscription required.
 *       404:
 *         description: No connected account found for this broker.
 */

/**
 * @openapi
 * /broker/sync-history:
 *   get:
 *     tags:
 *       - Broker
 *     summary: Sync History
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sync history fetched.
 */

/**
 * @openapi
 * /broker/sync-history/{id}:
 *   get:
 *     tags:
 *       - Broker
 *     summary: Get Sync Log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sync log fetched.
 *       404:
 *         description: Sync log not found.
 */
