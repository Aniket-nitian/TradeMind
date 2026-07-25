/**
 * @openapi
 * tags:
 *   - name: Notifications
 *     description: In-app notifications, including automated daily/weekly trading summaries
 */

/**
 * @openapi
 * /notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: List Notifications
 *     description: Returns a paginated list of the user's notifications, plus an unread count.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications fetched successfully.
 */

/**
 * @openapi
 * /notifications/{id}/read:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark As Read
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
 *         description: Notification marked as read.
 *       404:
 *         description: Notification not found.
 */

/**
 * @openapi
 * /notifications/read-all:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark All As Read
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read.
 */

/**
 * @openapi
 * /notifications/{id}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete Notification
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
 *         description: Notification deleted successfully.
 *       404:
 *         description: Notification not found.
 */
