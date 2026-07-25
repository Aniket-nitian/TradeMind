/**
 * @openapi
 * tags:
 *   - name: Strategy
 *     description: Trading strategy playbooks (setup/entry/exit/risk rules)
 */

/**
 * @openapi
 * /strategies:
 *   post:
 *     tags:
 *       - Strategy
 *     summary: Create Strategy
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               setupRules:
 *                 type: string
 *               entryRules:
 *                 type: string
 *               exitRules:
 *                 type: string
 *               riskRules:
 *                 type: string
 *               timeframe:
 *                 type: string
 *               market:
 *                 type: string
 *     responses:
 *       201:
 *         description: Strategy created successfully.
 *   get:
 *     tags:
 *       - Strategy
 *     summary: List Strategies
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Strategies fetched successfully.
 */

/**
 * @openapi
 * /strategies/{id}:
 *   get:
 *     tags:
 *       - Strategy
 *     summary: Get Strategy
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
 *         description: Strategy fetched successfully.
 *       404:
 *         description: Strategy not found.
 *   put:
 *     tags:
 *       - Strategy
 *     summary: Update Strategy
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
 *         description: Strategy updated successfully.
 *       404:
 *         description: Strategy not found.
 *   delete:
 *     tags:
 *       - Strategy
 *     summary: Delete Strategy
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
 *         description: Strategy deleted successfully.
 *       404:
 *         description: Strategy not found.
 */
