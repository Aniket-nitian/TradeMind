/**
 * @openapi
 * tags:
 *   - name: User
 *     description: User profile and account preferences
 */

/**
 * @openapi
 * /users/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get Profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *   put:
 *     tags:
 *       - User
 *     summary: Update Profile
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               avatarUrl:
 *                 type: string
 *               tradingExperience:
 *                 type: string
 *                 enum: [BEGINNER, INTERMEDIATE, ADVANCED, PROFESSIONAL]
 *               riskProfile:
 *                 type: string
 *                 enum: [LOW, MEDIUM, HIGH]
 *               preferredBroker:
 *                 type: string
 *               tradingStyle:
 *                 type: string
 *                 enum: [INTRADAY, SWING, POSITIONAL, SCALPING, INVESTOR]
 *               timezone:
 *                 type: string
 *               currency:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       409:
 *         description: Username already taken.
 */

/**
 * @openapi
 * /users/avatar:
 *   post:
 *     tags:
 *       - User
 *     summary: Upload Avatar
 *     description: Uploads a new profile avatar image (stored via Cloudinary) and updates the user's avatarUrl.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - avatar
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully.
 *       400:
 *         description: No file provided or invalid file type.
 */

/**
 * @openapi
 * /users/notifications:
 *   patch:
 *     tags:
 *       - User
 *     summary: Update Notification Preferences
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailNotificationsEnabled:
 *                 type: boolean
 *               whatsappNotificationsEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Notification preferences updated successfully.
 */

/**
 * @openapi
 * /users/deactivate:
 *   post:
 *     tags:
 *       - User
 *     summary: Deactivate Account
 *     description: Soft-deletes the account after verifying the user's current password, and revokes all refresh tokens.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deactivated successfully.
 *       401:
 *         description: Incorrect password.
 */
