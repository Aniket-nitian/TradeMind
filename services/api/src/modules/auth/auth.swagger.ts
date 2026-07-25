/**
 * @openapi
 * tags:
 *   - name: Authentication
 *     description: Authentication APIs
 */

/**
 * @openapi
 * components:
 *   schemas:
 *
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - username
 *         - email
 *         - password
 *       properties:
 *         firstName:
 *           type: string
 *           example: Aniket
 *
 *         lastName:
 *           type: string
 *           example: Chauhan
 *
 *         username:
 *           type: string
 *           example: aniket_07
 *
 *         email:
 *           type: string
 *           format: email
 *           example: aniket@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: Password@123
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: aniket@gmail.com
 *
 *         password:
 *           type: string
 *           format: password
 *           example: Password@123
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *
 *         message:
 *           type: string
 *           example: Login successful.
 *
 *         data:
 *           type: object
 *           properties:
 *             accessToken:
 *               type: string
 *
 *             refreshToken:
 *               type: string
 *
 *             user:
 *               type: object
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Register User
 *
 *     description: Creates a new user account.
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *
 *     responses:
 *
 *       201:
 *         description: User registered successfully.
 *
 *       400:
 *         description: Validation failed.
 *
 *       409:
 *         description: Email already exists.
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Login User
 *
 *     description: Login using email and password.
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Login successful.
 *
 *       401:
 *         description: Invalid credentials.
 */

/**
 * @openapi
 * /auth/google:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Login or Register with Google
 *
 *     description: Verifies a Google Identity Services ID token and logs the user in, linking or creating an account as needed.
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *
 *     responses:
 *
 *       200:
 *         description: Login successful.
 *
 *       401:
 *         description: Invalid Google token.
 */

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Logout User
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Logout successful.
 */

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Refresh Access Token
 *
 *     description: Issues a new access token using the refreshToken cookie.
 *
 *     responses:
 *
 *       200:
 *         description: Access token refreshed.
 *
 *       401:
 *         description: Missing or invalid refresh token.
 */

/**
 * @openapi
 * /auth/verify-email:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Verify Email
 *
 *     description: Verify email using OTP.
 *
 *     responses:
 *
 *       200:
 *         description: Email verified successfully.
 */

/**
 * @openapi
 * /auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Forgot Password
 *
 *     description: Sends password reset email.
 *
 *     responses:
 *
 *       200:
 *         description: Password reset email sent.
 */

/**
 * @openapi
 * /auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Reset Password
 *
 *     description: Reset password using token.
 *
 *     responses:
 *
 *       200:
 *         description: Password reset successfully.
 */

/**
 * @openapi
 * /auth/logout-all:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Logout All Devices
 *
 *     description: Revokes every refresh token/session for the current user.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Logged out from all devices.
 */

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Resend Verification Email
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Verification email sent.
 */

/**
 * @openapi
 * /auth/change-password:
 *   post:
 *     tags:
 *       - Authentication
 *
 *     summary: Change Password
 *
 *     description: Changes the current user's password given their current password.
 *
 *     security:
 *       - bearerAuth: []
 *
 *     requestBody:
 *       required: true
 *
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *
 *     responses:
 *
 *       200:
 *         description: Password changed successfully.
 *
 *       401:
 *         description: Current password is incorrect.
 */

/**
 * @openapi
 * /auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *
 *     summary: Get Current User
 *
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *
 *       200:
 *         description: Current authenticated user id.
 */

export {};