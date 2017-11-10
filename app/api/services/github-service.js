/**
 * Service module for GitHub functions
 * @requires bluebird
 * @requires request-promise
 */
const Promise = require('bluebird')
const rp = require('request-promise')

const GITHUB_API = 'https://api.github.com'
const USER = 'asheahan'

// TODO: create redis datastore

/**
 * Calls GitHub API and gets public info for user: asheahan
 * @returns {Object}
 */
exports.getUserPayload = () => {
  console.log('getUserPayload service')

  let user;

  return Promise.all([
    // get basic user info
    rp({
      uri: `${GITHUB_API}/users/${USER}`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': USER
      },
      json: true
    }),
    // get user repo's
    rp({
      uri: `${GITHUB_API}/users/${USER}/repos`,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': USER
      },
      json: true
    })
  ])
  .then(results => {
    // TODO: figure out who the repo owner is
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
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': USER
        },
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
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': USER
        },
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

    return user
  })
}