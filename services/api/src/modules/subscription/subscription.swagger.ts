/**
 * @openapi
 * tags:
 *   - name: Subscription
 *     description: Razorpay-backed subscription management and payment history
 */

/**
 * @openapi
 * /subscription/subscribe:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Create Subscription
 *     description: Creates a Razorpay subscription and returns checkout details (subscription id, key id, hosted short url). Does not activate Premium — only a verified payment (via /verify or the webhook) does that.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Subscription created — complete checkout to activate.
 */

/**
 * @openapi
 * /subscription:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Subscription Status
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status fetched successfully.
 */

/**
 * @openapi
 * /subscription/verify:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Verify Payment & Activate
 *     description: Verifies the HMAC-SHA256 signature Razorpay Checkout.js returns client-side on successful payment (paymentId + subscriptionId + signature) and activates Premium immediately — no dependency on webhook delivery.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [paymentId, subscriptionId, signature]
 *             properties:
 *               paymentId:
 *                 type: string
 *               subscriptionId:
 *                 type: string
 *               signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified — Premium is now active.
 *       400:
 *         description: Invalid payment signature.
 */

/**
 * @openapi
 * /subscription/sync:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Sync Subscription Status
 *     description: Pulls the current subscription state directly from Razorpay and reconciles it into our DB — a fallback for when the checkout modal closes before the client-side handler fires.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription status synced successfully.
 *       404:
 *         description: No subscription found.
 */

/**
 * @openapi
 * /subscription/cancel:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Cancel Subscription
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription cancelled successfully.
 *       404:
 *         description: No active subscription found.
 */

/**
 * @openapi
 * /subscription/payments:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Payment History
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Payment history fetched successfully.
 */

/**
 * @openapi
 * /subscription/webhook:
 *   post:
 *     tags:
 *       - Subscription
 *     summary: Razorpay Webhook
 *     description: Receives subscription lifecycle events from Razorpay (subscription.activated/charged/cancelled). Verified via HMAC-SHA256 signature (x-razorpay-signature header), not authenticated as a user request. Primarily the source of truth for renewal charges after the first payment.
 *     responses:
 *       200:
 *         description: Event processed.
 *       400:
 *         description: Invalid webhook signature.
 */
