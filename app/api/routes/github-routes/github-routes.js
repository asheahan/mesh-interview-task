/**
 * Module for GitHub route handlers
 * @requires ../../services/github-service
 */
const githubService = require('../../services/github-service')

/**
 * Calls GitHub service to retrieve payload from cache if exists
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.getUserPayloadCache = (req, res, next) => {
  console.log('getUserPayloadCache route')

  githubService.getUserPayloadCache()
    .then(payload => {
      if (payload) {
        res.status(200)
          .send(payload)
      } else {
        next()
      }
    })
    .catch(err => {
      console.error(`Error getting GitHub payload from cache: ${err.message}`)
      next(err)
    })
}

/**
 * Calls GitHub service to get payload and returns response
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
exports.getUserPayload = (req, res, next) => {
  console.log('getUserPayload route')

  githubService.getUserPayload()
    .then(payload => {
      res.status(200)
        .send(payload)
    })
    .catch(err => {
      console.error(`Error getting GitHub payload: ${err.message}`)
      next(err)
    })
}
