/**
 * @openapi
 * tags:
 *   - name: Portfolio
 *     description: Capital tracking, holdings, and portfolio value analytics
 */

/**
 * @openapi
 * /portfolio/capital:
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Record Capital Transaction
 *     description: Records a deposit or withdrawal to the user's capital ledger.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Capital transaction recorded successfully.
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Capital History
 *     description: Returns a paginated list of the user's capital transactions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Capital history fetched successfully.
 */

/**
 * @openapi
 * /portfolio/capital/{id}:
 *   delete:
 *     tags:
 *       - Portfolio
 *     summary: Delete Capital Transaction
 *     description: Soft-deletes a capital transaction (e.g. to correct a mistaken entry).
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
 *         description: Capital transaction deleted successfully.
 *       404:
 *         description: Capital transaction not found.
 */

/**
 * @openapi
 * /portfolio/value:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Current Portfolio Value
 *     description: Live snapshot of capital, invested cost, realized P&L, unrealized P&L (via best-effort market quotes), cash, and total value — computed on demand, not persisted.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio value fetched successfully.
 */

/**
 * @openapi
 * /portfolio/holdings:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Current Holdings
 *     description: Returns currently open positions grouped by symbol, with unrealized P&L where a live quote is resolvable (equity symbols only — futures/options and unrecognized tickers return null price/P&L fields).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Holdings fetched successfully.
 */

/**
 * @openapi
 * /portfolio/snapshot:
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Create Portfolio Snapshot
 *     description: Computes and persists a point-in-time portfolio value snapshot (on-demand — no background scheduler yet).
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Portfolio snapshot created successfully.
 */

/**
 * @openapi
 * /portfolio/snapshots:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Snapshot History
 *     description: Returns a paginated list of past portfolio snapshots, usable for an equity curve.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Snapshot history fetched successfully.
 */

/**
 * @openapi
 * /portfolio/analytics:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: Portfolio Analytics
 *     description: Returns allocation breakdown (by symbol/segment/strategy), capital utilization %, and return % on net capital.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Portfolio analytics fetched successfully.
 */
