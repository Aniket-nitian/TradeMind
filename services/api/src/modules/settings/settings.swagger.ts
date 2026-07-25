/**
 * @openapi
 * tags:
 *   - name: Settings
 *     description: Trading/broker preferences and active session management
 */

/**
 * @openapi
 * /settings:
 *   get:
 *     tags:
 *       - Settings
 *     summary: Get Settings
 *     description: Returns the user's full profile plus their active session count, for a single settings screen.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Settings fetched successfully.
 */

/**
 * @openapi
 * /settings/trading-preferences:
 *   patch:
 *     tags:
 *       - Settings
 *     summary: Update Trading Preferences
 *     description: Sets default account size and risk % used to prefill calculators and risk management tools.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               defaultAccountSize:
 *                 type: number
 *               defaultRiskPercent:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *     responses:
 *       200:
 *         description: Trading preferences updated successfully.
 */

/**
 * @openapi
 * /settings/broker-preferences:
 *   patch:
 *     tags:
 *       - Settings
 *     summary: Update Broker Preferences
 *     description: Sets the preferred broker and how many days of history to fetch on each sync.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferredBroker:
 *                 type: string
 *                 enum: [ZERODHA, ANGEL_ONE, UPSTOX, GROWW, DHAN, FYERS, ICICI_DIRECT]
 *               brokerSyncLookbackDays:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 365
 *     responses:
 *       200:
 *         description: Broker preferences updated successfully.
 */

/**
 * @openapi
 * /settings/sessions:
 *   get:
 *     tags:
 *       - Settings
 *     summary: List Active Sessions
 *     description: Returns all currently active login sessions (device/IP/last-active) for the user, for a "manage devices" security screen.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active sessions fetched successfully.
 */

/**
 * @openapi
 * /settings/sessions/{id}:
 *   delete:
 *     tags:
 *       - Settings
 *     summary: Revoke Session
 *     description: Signs a specific device/session out by revoking its refresh tokens.
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
 *         description: Session revoked successfully.
 *       404:
 *         description: Session not found.
 */
