/**
 * Service module for GitHub functions
 * @requires bluebird
 * @requires request-promise
 * @requires ./cache-service
 */
const Promise = require('bluebird')
const rp = require('request-promise')
const cache = require('./cache-service')

const GITHUB_API = 'https://api.github.com'
const USER = 'asheahan'

let headers = {
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': USER
}

/**
 * Checks store for cached response
 * @returns {Promise}
 */
exports.getUserPayloadCache = () => {
  console.log('getUserPayloadCache service')

  let payload = cache.get(USER)

  if (payload) {
    return Promise.resolve(payload)
  } else {
    return Promise.resolve()
  }
}

/**
 * Calls GitHub API and gets public info for user: asheahan
 * @returns {Promise}
 */
exports.getUserPayload = () => {
  console.log('getUserPayload service')

  let user

  return Promise.all([
    // get basic user info
    rp({
      uri: `${GITHUB_API}/users/${USER}`,
      headers,
      json: true
    }),
    // get user repo's
    rp({
      uri: `${GITHUB_API}/users/${USER}/repos`,
      headers,
      json: true
    })
  ])
    .then(results => {
      user = {
        githubHandle: results[0].login,
        githubURL: results[0].url,
        avatarURL: results[0].avatar_url,
        email: results[0].email,
        followerCount: results[0].followers,
        repositories: results[1].map(repo => {
          return {
            name: repo.name,
            url: repo.html_url
          }
        })
      }

      // map repo names to request
      let repoFuncs = user.repositories.reduce((acc, repo) => {
        acc[repo.name] = rp({
          uri: `${GITHUB_API}/repos/${USER}/${repo.name}/commits`,
          headers,
          json: true
        })
        return acc
      }, {})

      // get repo commits
      return Promise.props(repoFuncs)
    })
    .then(results => {
      user.repositories.forEach(repo => {
        repo.commitCount = results[repo.name].length
      })

      // map repo names to request
      let repoFuncs = user.repositories.reduce((acc, repo) => {
        acc[repo.name] = rp({
          uri: `${GITHUB_API}/repos/${USER}/${repo.name}/pulls`,
          headers,
          json: true
        })
        return acc
      }, {})

      // get repo pulls
      return Promise.props(repoFuncs)
    })
    .then(results => {
      user.repositories.forEach(repo => {
        repo.pullRequestCount = results[repo.name].length
      })

      // cache result for subsequent calls
      cache.set(USER, user)

      return user
    })
}
