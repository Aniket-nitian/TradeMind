/**
 * @openapi
 * tags:
 *   - name: Trade
 *     description: Trade CRUD, journal notes, checklist, emotions, and image attachments
 */

/**
 * @openapi
 * /trades:
 *   post:
 *     tags:
 *       - Trade
 *     summary: Create Trade
 *     description: Creates a trade and computes P&L, risk/reward, and status (OPEN/CLOSED) from the given entry/exit data.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - symbol
 *               - segment
 *               - product
 *               - side
 *               - quantity
 *               - entryPrice
 *               - entryTime
 *             properties:
 *               broker:
 *                 type: string
 *               exchange:
 *                 type: string
 *               symbol:
 *                 type: string
 *               segment:
 *                 type: string
 *                 enum: [EQUITY, FUTURES, OPTIONS, CURRENCY, COMMODITY]
 *               product:
 *                 type: string
 *                 enum: [CNC, MIS, NRML]
 *               side:
 *                 type: string
 *                 enum: [BUY, SELL]
 *               quantity:
 *                 type: number
 *               entryPrice:
 *                 type: number
 *               exitPrice:
 *                 type: number
 *               stopLoss:
 *                 type: number
 *               target:
 *                 type: number
 *               brokerage:
 *                 type: number
 *               taxes:
 *                 type: number
 *               confidence:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 10
 *               strategyId:
 *                 type: string
 *               tradeNotes:
 *                 type: string
 *               lessonLearned:
 *                 type: string
 *               reasonForEntry:
 *                 type: string
 *               reasonForExit:
 *                 type: string
 *               followedPlan:
 *                 type: boolean
 *               emotionBefore:
 *                 type: string
 *               emotionAfter:
 *                 type: string
 *               entryTime:
 *                 type: string
 *                 format: date-time
 *               exitTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Trade created successfully.
 *   get:
 *     tags:
 *       - Trade
 *     summary: List Trades
 *     description: Returns a paginated list of the user's trades.
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
 *         description: Trades fetched successfully.
 */

/**
 * @openapi
 * /trades/search:
 *   get:
 *     tags:
 *       - Trade
 *     summary: Search Trades
 *     description: Returns a short list of trades matching the query against symbol, entry reasoning, and notes — used for the topbar quick-search.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 20
 *     responses:
 *       200:
 *         description: Trades fetched successfully.
 */

/**
 * @openapi
 * /trades/embeddings/pending:
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trades Pending Embedding
 *     description: Returns closed trades that don't yet have a journal embedding, for the RAG semantic-search backfill.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending embeddings fetched successfully.
 */

/**
 * @openapi
 * /trades/embeddings:
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Embedded Trades
 *     description: Returns trades that already have a journal embedding stored.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Embedded trades fetched successfully.
 */

/**
 * @openapi
 * /trades/{id}/embedding:
 *   post:
 *     tags:
 *       - Trade
 *     summary: Save Trade Embedding
 *     description: Stores a precomputed vector embedding of the trade's journal notes for semantic search.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - embedding
 *             properties:
 *               embedding:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Embedding saved successfully.
 */

/**
 * @openapi
 * /trades/{id}/details:
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trade Details
 *     description: Returns a trade with its related checklist items, tags, mistakes, and images.
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
 *         description: Trade details fetched successfully.
 *       404:
 *         description: Trade not found.
 */

/**
 * @openapi
 * /trades/{id}:
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trade
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
 *         description: Trade fetched successfully.
 *       404:
 *         description: Trade not found.
 *   put:
 *     tags:
 *       - Trade
 *     summary: Update Trade
 *     description: Merges the given fields with the existing trade and recomputes P&L/status.
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
 *         description: Trade updated successfully.
 *       404:
 *         description: Trade not found.
 *   delete:
 *     tags:
 *       - Trade
 *     summary: Delete Trade
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
 *         description: Trade deleted successfully.
 *       404:
 *         description: Trade not found.
 */

/**
 * @openapi
 * /trades/{id}/checklist:
 *   post:
 *     tags:
 *       - Trade
 *     summary: Add Checklist Item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       201:
 *         description: Checklist item created successfully.
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trade Checklist
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
 *         description: Checklist fetched successfully.
 */

/**
 * @openapi
 * /trades/checklist/{id}:
 *   patch:
 *     tags:
 *       - Trade
 *     summary: Update Checklist Item
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               isChecked:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Checklist item updated successfully.
 *   delete:
 *     tags:
 *       - Trade
 *     summary: Delete Checklist Item
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
 *         description: Checklist item deleted successfully.
 */

/**
 * @openapi
 * /trades/{id}/emotions:
 *   patch:
 *     tags:
 *       - Trade
 *     summary: Update Trade Emotions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emotionBefore:
 *                 type: string
 *                 enum: [CONFIDENT, FEAR, GREED, FOMO, REVENGE, DISCIPLINED, HESITATION, CALM, ANXIOUS, FOCUSED, BORED]
 *               emotionAfter:
 *                 type: string
 *                 enum: [CONFIDENT, FEAR, GREED, FOMO, REVENGE, DISCIPLINED, HESITATION, CALM, ANXIOUS, FOCUSED, BORED]
 *     responses:
 *       200:
 *         description: Trade emotions updated successfully.
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trade Emotions
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
 *         description: Trade emotions fetched successfully.
 */

/**
 * @openapi
 * /trades/{tradeId}/images:
 *   post:
 *     tags:
 *       - Trade
 *     summary: Upload Trade Image
 *     description: Uploads a chart/screenshot image for a trade to Cloudinary.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tradeId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Trade image uploaded successfully.
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trade Images
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
 *         description: Trade images fetched successfully.
 */

/**
 * @openapi
 * /trades/images/{imageId}:
 *   delete:
 *     tags:
 *       - Trade
 *     summary: Delete Trade Image
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trade image deleted successfully.
 */

/**
 * @openapi
 * /trades/{id}/journal:
 *   patch:
 *     tags:
 *       - Trade
 *     summary: Update Trade Journal
 *     description: Updates the reflective journal fields (notes, lessons, entry/exit reasoning, plan adherence) on an existing trade, independent of the trade's core CRUD.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tradeNotes:
 *                 type: string
 *               lessonLearned:
 *                 type: string
 *               reasonForEntry:
 *                 type: string
 *               reasonForExit:
 *                 type: string
 *               followedPlan:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Trade journal updated successfully.
 *   get:
 *     tags:
 *       - Trade
 *     summary: Get Trade Journal
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
 *         description: Trade journal fetched successfully.
 */
