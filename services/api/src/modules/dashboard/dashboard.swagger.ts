/**
 * @openapi
 * tags:
 *   - name: Dashboard
 *     description: Dashboard analytics APIs
 */

/**
 * @openapi
 * /dashboard/overview:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Dashboard Overview
 *     description: Returns dashboard overview statistics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Overview fetched successfully.
 */

/**
 * @openapi
 * /dashboard/equity-curve:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Equity Curve
 *     description: Returns equity curve analytics.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Equity curve fetched successfully.
 */

/**
 * @openapi
 * /dashboard/monthly-performance:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Monthly Performance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly performance fetched successfully.
 */

/**
 * @openapi
 * /dashboard/win-loss:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Win Loss Distribution
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Win loss distribution fetched successfully.
 */

/**
 * @openapi
 * /dashboard/strategies:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Strategy Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Strategy analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/brokers:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Broker Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Broker analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/mistakes:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Mistake Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Mistake analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/psychology:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Psychology Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Psychology analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/calendar:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Calendar Heatmap
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Calendar heatmap fetched successfully.
 */

/**
 * @openapi
 * /dashboard/drawdown:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Drawdown Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Drawdown analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/holding-time:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Holding Time Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Holding time analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/day-of-week:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Day Of Week Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Day of week analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/time-of-day:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Time Of Day Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Time of day analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/confidence:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Confidence Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Confidence analytics fetched successfully.
 */

/**
 * @openapi
 * /dashboard/streaks:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Trade Streak Analytics
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Trade streak analytics fetched successfully.
 */

export {};