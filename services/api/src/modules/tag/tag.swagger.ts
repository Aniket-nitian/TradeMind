/**
 * @openapi
 * tags:
 *   - name: Tag
 *     description: Free-form trade tags and their trade associations
 */

/**
 * @openapi
 * /tags:
 *   post:
 *     tags:
 *       - Tag
 *     summary: Create Tag
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
 *               color:
 *                 type: string
 *                 description: Hex color, e.g. #FF5733
 *     responses:
 *       201:
 *         description: Tag created successfully.
 *   get:
 *     tags:
 *       - Tag
 *     summary: List Tags
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tags fetched successfully.
 */

/**
 * @openapi
 * /tags/{id}:
 *   get:
 *     tags:
 *       - Tag
 *     summary: Get Tag
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
 *         description: Tag fetched successfully.
 *       404:
 *         description: Tag not found.
 *   put:
 *     tags:
 *       - Tag
 *     summary: Update Tag
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
 *         description: Tag updated successfully.
 *       404:
 *         description: Tag not found.
 *   delete:
 *     tags:
 *       - Tag
 *     summary: Delete Tag
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
 *         description: Tag deleted successfully.
 *       404:
 *         description: Tag not found.
 */

/**
 * @openapi
 * /tags/trades/{tradeId}/{tagId}:
 *   post:
 *     tags:
 *       - Tag
 *     summary: Attach Tag to Trade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Tag attached to trade successfully.
 *   delete:
 *     tags:
 *       - Tag
 *     summary: Remove Tag from Trade
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tag removed from trade successfully.
 */

/**
 * @openapi
 * /tags/trades/{tradeId}:
 *   get:
 *     tags:
 *       - Tag
 *     summary: Get Trade Tags
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
 *         description: Trade tags fetched successfully.
 */
