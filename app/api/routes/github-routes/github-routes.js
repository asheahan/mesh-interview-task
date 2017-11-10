/**
 * Module for GitHub route handlers
 * @requires ../../services/github-service
 */
const githubService = require('../../services/github-service')

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
      next(err);
    })
}