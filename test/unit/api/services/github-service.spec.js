/**
 * Unit testing module for GitHub service functions
 * @requires lodash
 * @requires assert
 * @requires proxyquire
 * @requires sinon
 * @requires ../../../../app/api/services/github-service
 */
const _ = require('lodash')
const assert = require('assert')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

const GITHUB_API = 'https://api.github.com'
const USER = 'asheahan'

describe('GitHub Service', () => {
  let githubService

  beforeEach(() => {
    githubService = null
  })

  describe('getUserPayloadCache', () => {
    it('should return the payload if found in cache', done => {
      let get = sinon.stub().returns({ githubHandle: 'asheahan' })

      githubService = proxyquire('../../../../app/api/services/github-service', {
        './cache-service': {
          get
        }
      })

      githubService.getUserPayloadCache()
        .then(result => {
          assert.ok(result)
          assert.ok(result.githubHandle)
          assert.equal(result.githubHandle, 'asheahan')
          done()
        })
        .catch(err => {
          assert.fail('Should not error')
          done()
        })
    })

    it('should resolve if payload not found in cache', done => {
      let get = sinon.stub().returns()

      githubService = proxyquire('../../../../app/api/services/github-service', {
        './cache-service': {
          get
        }
      })

      githubService.getUserPayloadCache()
        .then(result => {
          assert.equal(result, undefined)
          done()
        })
        .catch(err => {
          assert.fail('Should not error')
          done()
        })
    })
  })

  describe('getUserPayload', () => {
    let requestArgs

    beforeEach(() => {
      requestArgs = {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': USER
        },
        json: true
      }
    })

    it('should call the GitHub API to get User info', done => {
      requestArgs.uri = 'https://api.github.com/users/asheahan'

      let requestStub = sinon.stub()
      requestStub.withArgs(requestArgs).returns({
        login: 'asheahan',
        url: 'https://test.com',
        avatar_url: 'https://test-avatar.com',
        email: 'test@test.com',
        followers: 23
      })
      requestStub.returns([])

      githubService = proxyquire('../../../../app/api/services/github-service', {
        'request-promise': requestStub
      })

      githubService.getUserPayload()
        .then(payload => {
          assert(requestStub.calledWith(requestArgs))
          done()
        })
        .catch(err => {
          assert.fail('Should not fail')
          done()
        })
    })

    it('should call the GitHub API to get repositories', done => {
      requestArgs.uri = 'https://api.github.com/users/asheahan/repos'

      let requestStub = sinon.stub()
      requestStub.withArgs(requestArgs).returns([ { name: 'test', html_url: 'https://test.com' } ])
      requestStub.returns({})

      githubService = proxyquire('../../../../app/api/services/github-service', {
        'request-promise': requestStub
      })

      githubService.getUserPayload()
        .then(payload => {
          assert(requestStub.calledWith(requestArgs))
          done()
        })
        .catch(err => {
          assert.fail('Should not fail')
          done()
        })
    })

    it('should call the GitHub API to get commits for all repositories', done => {
      let repoRequest1Args = _.cloneDeep(requestArgs)
      repoRequest1Args.uri = 'https://api.github.com/repos/asheahan/test/commits'

      let repoRequest2Args = _.cloneDeep(requestArgs)
      repoRequest2Args.uri = 'https://api.github.com/repos/asheahan/anotherTest/commits'

      requestArgs.uri = 'https://api.github.com/users/asheahan/repos'

      let requestStub = sinon.stub()
      requestStub.withArgs(requestArgs).returns([
        {
          name: 'test',
          html_url: 'https://test.com'
        },
        {
          name: 'anotherTest',
          html_url: 'https://another-test.com'
        }
      ])
      requestStub.returns({})

      githubService = proxyquire('../../../../app/api/services/github-service', {
        'request-promise': requestStub
      })

      githubService.getUserPayload()
        .then(payload => {
          assert(requestStub.calledWith(repoRequest1Args))
          assert(requestStub.calledWith(repoRequest2Args))
          done()
        })
        .catch(err => {
          assert.fail('Should not fail')
          done()
        })
    })

    it('should call the GitHub API to get pull requests for all repositories', done => {
      let repoRequest1Args = _.cloneDeep(requestArgs)
      repoRequest1Args.uri = 'https://api.github.com/repos/asheahan/test/pulls'

      let repoRequest2Args = _.cloneDeep(requestArgs)
      repoRequest2Args.uri = 'https://api.github.com/repos/asheahan/anotherTest/pulls'

      requestArgs.uri = 'https://api.github.com/users/asheahan/repos'

      let requestStub = sinon.stub()
      requestStub.withArgs(requestArgs).returns([
        {
          name: 'test',
          html_url: 'https://test.com'
        },
        {
          name: 'anotherTest',
          html_url: 'https://another-test.com'
        }
      ])
      requestStub.returns({})

      githubService = proxyquire('../../../../app/api/services/github-service', {
        'request-promise': requestStub
      })

      githubService.getUserPayload()
        .then(payload => {
          assert(requestStub.calledWith(repoRequest1Args))
          assert(requestStub.calledWith(repoRequest2Args))
          done()
        })
        .catch(err => {
          assert.fail('Should not fail')
          done()
        })
    })

    it('should map GitHub API values to return payload', done => {
      let repoRequestArgs = _.cloneDeep(requestArgs)
      repoRequestArgs.uri = 'https://api.github.com/users/asheahan/repos'

      let repoCommitRequest1Args = _.cloneDeep(requestArgs)
      repoCommitRequest1Args.uri = 'https://api.github.com/repos/asheahan/test/commits'

      let repoCommitRequest2Args = _.cloneDeep(requestArgs)
      repoCommitRequest2Args.uri = 'https://api.github.com/repos/asheahan/anotherTest/commits'

      let repoPullRequest1Args = _.cloneDeep(requestArgs)
      repoPullRequest1Args.uri = 'https://api.github.com/repos/asheahan/test/pulls'

      let repoPullRequest2Args = _.cloneDeep(requestArgs)
      repoPullRequest2Args.uri = 'https://api.github.com/repos/asheahan/anotherTest/pulls'

      requestArgs.uri = 'https://api.github.com/users/asheahan'

      let requestStub = sinon.stub()
      requestStub.withArgs(requestArgs).returns({
        login: 'asheahan',
        url: 'https://test.com',
        avatar_url: 'https://test-avatar.com',
        email: 'test@test.com',
        followers: 23
      })
      requestStub.withArgs(repoRequestArgs).returns([
        {
          name: 'test',
          html_url: 'https://test.com'
        },
        {
          name: 'anotherTest',
          html_url: 'https://another-test.com'
        }
      ])
      requestStub.withArgs(repoCommitRequest1Args).returns([{ commit: 1 }, { commit: 2 }])
      requestStub.withArgs(repoCommitRequest2Args).returns([{ commit: 1 }, { commit: 2 }, { commit: 3 }])
      requestStub.withArgs(repoPullRequest1Args).returns([{ pull: 1 }])
      requestStub.withArgs(repoPullRequest2Args).returns([{ pull: 1 }, { pull: 2 }, { pull: 3 }, { pull: 4 }])

      githubService = proxyquire('../../../../app/api/services/github-service', {
        'request-promise': requestStub
      })

      githubService.getUserPayload()
        .then(payload => {
          assert.deepEqual(payload, {
            githubHandle: 'asheahan',
            githubURL: 'https://test.com',
            avatarURL: 'https://test-avatar.com',
            email: 'test@test.com',
            followerCount: 23,
            repositories: [
              {
                name: 'test',
                url: 'https://test.com',
                commitCount: 2,
                pullRequestCount: 1
              },
              {
                name: 'anotherTest',
                url: 'https://another-test.com',
                commitCount: 3,
                pullRequestCount: 4
              }
            ]
          })
          done()
        })
        .catch(err => {
          assert.fail('Should not fail')
          done()
        })
    })

    it('should set the payload in the cache', done => {
      requestArgs.uri = 'https://api.github.com/users/asheahan'

      let requestStub = sinon.stub()
      requestStub.withArgs(requestArgs).returns({
        login: 'asheahan',
        url: 'https://test.com',
        avatar_url: 'https://test-avatar.com',
        email: 'test@test.com',
        followers: 23
      })
      requestStub.returns([])

      let set = sinon.stub()

      githubService = proxyquire('../../../../app/api/services/github-service', {
        'request-promise': requestStub,
        './cache-service': {
          set
        }
      })

      githubService.getUserPayload()
        .then(payload => {
          assert.ok(set.called)
          assert.ok(set.calledWith('asheahan', {
            githubHandle: 'asheahan',
            githubURL: 'https://test.com',
            avatarURL: 'https://test-avatar.com',
            email: 'test@test.com',
            followerCount: 23,
            repositories: []
          }))
          done()
        })
        .catch(err => {
          assert.fail('Should not fail')
          done()
        })
    })
  })
})