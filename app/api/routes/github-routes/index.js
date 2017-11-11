/**
 * Module for GitHub route definitions
 * @requires express
 * @requires ./github-routes
 */
const express = require('express')
const githubRoutes = require('./github-routes')

let githubRouter = express.Router()

module.exports = function (router) {
  githubRouter.get('/githubPayload', githubRoutes.getUserPayloadCache, githubRoutes.getUserPayload)

  router.use(githubRouter)
}
