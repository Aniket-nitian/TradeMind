/**
 * @openapi
 * tags:
 *   - name: Mistake
 *     description: Behavioral mistake tags and their trade associations
 */

/**
 * @openapi
 * /mistakes:
 *   post:
 *     tags:
 *       - Mistake
 *     summary: Create Mistake
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
 *     responses:
 *       201:
 *         description: Mistake created successfully.
 *   get:
 *     tags:
 *       - Mistake
 *     summary: List Mistakes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mistakes fetched successfully.
 */

/**
 * @openapi
 * /mistakes/{id}:
 *   get:
 *     tags:
 *       - Mistake
 *     summary: Get Mistake
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
 *         description: Mistake fetched successfully.
 *       404:
 *         description: Mistake not found.
 *   put:
 *     tags:
 *       - Mistake
 *     summary: Update Mistake
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
 *         description: Mistake updated successfully.
 *       404:
 *         description: Mistake not found.
 *   delete:
 *     tags:
 *       - Mistake
 *     summary: Delete Mistake
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
 *         description: Mistake deleted successfully.
 *       404:
 *         description: Mistake not found.
 */

/**
 * @openapi
 * /mistakes/trades/{tradeId}/{mistakeId}:
 *   post:
 *     tags:
 *       - Mistake
 *     summary: Attach Mistake to Trade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: mistakeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Mistake attached to trade successfully.
 *   delete:
 *     tags:
 *       - Mistake
 *     summary: Remove Mistake from Trade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: mistakeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mistake removed from trade successfully.
 */

/**
 * @openapi
 * /mistakes/trades/{tradeId}:
 *   get:
 *     tags:
 *       - Mistake
 *     summary: Get Trade Mistakes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trade mistakes fetched successfully.
 */
