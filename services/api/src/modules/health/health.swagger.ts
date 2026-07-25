/**
 * @openapi
 * tags:
 *   - name: Health
 *     description: Service liveness and dependency status
 */

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health Check
 *     description: Returns service status, uptime, and database connectivity.
 *     responses:
 *       200:
 *         description: Service is healthy.
 *       503:
 *         description: Service is unhealthy (e.g. database unreachable).
 */
