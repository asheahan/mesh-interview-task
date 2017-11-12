/**
 * Module for GitHub route definitions
 * @requires express
 * @requires ./github-routes
 */
const express = require('express')
const githubRoutes = require('./github-routes')

let githubRouter = express.Router()

module.exports = function (router) {
  /**
   * @swagger
   * /githubPayload:
   *   get:
   *     tags:
   *       - GitHub
   *     description: Returns GitHub info for user asheahan
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: GitHub info
   *         schema:
   *           properties:
   *             githubHandle:
   *               type: string
   *             githubURL:
   *               type: string
   *             avatarURL:
   *               type: string
   *             email:
   *               type: string
   *             followerCount:
   *               type: integer
   *             repositories:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   name:
   *                     type: string
   *                   url:
   *                     type: string
   *                   commitCount:
   *                     type: integer
   *                   pullRequestCount:
   *                     type: integer
   */
  githubRouter.get('/githubPayload', githubRoutes.getUserPayloadCache, githubRoutes.getUserPayload)

  router.use(githubRouter)
}
