/**
 * @openapi
 * tags:
 *   - name: AI Conversations
 *     description: Chat Assistant conversation/message persistence (used by the AI service)
 */

/**
 * @openapi
 * /ai/conversations:
 *   post:
 *     tags:
 *       - AI Conversations
 *     summary: Create Conversation
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               contextType:
 *                 type: string
 *     responses:
 *       201:
 *         description: Conversation created successfully.
 *   get:
 *     tags:
 *       - AI Conversations
 *     summary: List Conversations
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
 *         description: Conversations fetched successfully.
 */

/**
 * @openapi
 * /ai/conversations/{id}:
 *   get:
 *     tags:
 *       - AI Conversations
 *     summary: Get Conversation
 *     description: Returns a conversation with its full message history, ordered oldest to newest.
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
 *         description: Conversation fetched successfully.
 *       404:
 *         description: Conversation not found.
 *   delete:
 *     tags:
 *       - AI Conversations
 *     summary: Delete Conversation
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
 *         description: Conversation deleted successfully.
 *       404:
 *         description: Conversation not found.
 */

/**
 * @openapi
 * /ai/conversations/{id}/messages:
 *   post:
 *     tags:
 *       - AI Conversations
 *     summary: Add Message
 *     description: Appends a message to a conversation. Used by the AI service to persist both the user's message and the assistant's reply.
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
 *               - role
 *               - content
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, assistant]
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message added successfully.
 *       404:
 *         description: Conversation not found.
 */

/**
 * @openapi
 * /ai/messages/recent:
 *   get:
 *     tags:
 *       - AI Conversations
 *     summary: Get Recent Messages
 *     description: Returns the user's most recent messages across all conversations, used as short-term context for the Chat Assistant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 40
 *     responses:
 *       200:
 *         description: Recent messages fetched successfully.
 */

/**
 * @openapi
 * /ai/memory:
 *   get:
 *     tags:
 *       - AI Conversations
 *     summary: Get Long-Term Memory
 *     description: Returns the user's long-term memory summary consolidated across past conversations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Memory fetched successfully.
 *   put:
 *     tags:
 *       - AI Conversations
 *     summary: Update Long-Term Memory
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - summary
 *             properties:
 *               summary:
 *                 type: string
 *                 maxLength: 4000
 *     responses:
 *       200:
 *         description: Memory updated successfully.
 */
