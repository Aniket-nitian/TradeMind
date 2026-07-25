/**
 * @openapi
 * tags:
 *   - name: CSV Import
 *     description: Bulk trade import from broker CSV exports
 */

/**
 * @openapi
 * /csv/upload:
 *   post:
 *     tags:
 *       - CSV Import
 *     summary: Upload & Preview CSV
 *     description: Parses a broker CSV export, validates rows, flags duplicates against existing trades, and persists a pending import batch for later confirmation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               broker:
 *                 type: string
 *                 description: Optional broker hint (e.g. GROWW) to select a broker-specific adapter. When omitted, the file's own content is sniffed to auto-detect a known broker export (Dhan, Groww, Zerodha, Fyers, Angel One); if nothing matches, falls back to the generic internal column format.
 *     responses:
 *       200:
 *         description: CSV parsed and pending import batch created.
 */

/**
 * @openapi
 * /csv/{importId}/confirm:
 *   post:
 *     tags:
 *       - CSV Import
 *     summary: Confirm Import
 *     description: Creates Trade records from a previously previewed import batch and marks it as completed/partial.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: importId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Import confirmed successfully.
 *       404:
 *         description: Import batch not found.
 */

/**
 * @openapi
 * /csv/history:
 *   get:
 *     tags:
 *       - CSV Import
 *     summary: Import History
 *     description: Returns a paginated list of the user's past CSV import batches.
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
 *         description: Import history fetched successfully.
 */

/**
 * @openapi
 * /csv/history/{importId}:
 *   get:
 *     tags:
 *       - CSV Import
 *     summary: Import Detail
 *     description: Returns a single CSV import batch, including its stored rows and validation errors.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: importId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Import fetched successfully.
 *       404:
 *         description: Import batch not found.
 */
