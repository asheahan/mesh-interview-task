/**
 * Unit testing module for GitHub route handlers
 * @requires assert
 * @requires events
 * @requires node-mocks-http
 * @requires proxyquire
 * @requires sinon
 * @requires ../../../../../app/api/routes/github-routes/github-routes
 */
const assert = require('assert')
const events = require('events')
const httpMocks = require('node-mocks-http')
const proxyquire = require('proxyquire')
const sinon = require('sinon')

describe('GitHub Handlers', () => {
  let req, res, next, handlers

  beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse({
      eventEmitter: events.EventEmitter
    })
    next = sinon.stub()
  })

  describe('getUserPayloadCache', () => {
    it('should send payload if found in cache', done => {
      let getUserPayloadCache = sinon.stub().returns(Promise.resolve({ message: 'testing' })),
          getUserPayload = sinon.stub()

      let handlerStub = {
        getUserPayloadCache,
        getUserPayload
      }

      handlers = proxyquire('../../../../../app/api/routes/github-routes/github-routes', {
        '../../services/github-service': handlerStub
      })

      handlers.getUserPayloadCache(req, res, function (err) {
        assert.fail('Next should not be called')
        done()
      })

      res.on('end', function () {
        let data = res._getData()
        assert.ok(getUserPayloadCache.called)
        assert.ok(data)
        assert.ok(data.message)
        assert.equal(data.message, 'testing')
        assert.equal(getUserPayload.called, false)
        done()
      })
    })

    it('should pass through if no payload returned', done => {
      let getUserPayloadCache = sinon.stub().returns(Promise.resolve()),
          getUserPayload = sinon.stub()

      let handlerStub = {
        getUserPayloadCache,
        getUserPayload
      }

      handlers = proxyquire('../../../../../app/api/routes/github-routes/github-routes', {
        '../../services/github-service': handlerStub
      })

      handlers.getUserPayloadCache(req, res, function () {
        assert(getUserPayloadCache.called)
        assert.equal(getUserPayload.called, false)
        done()
      })
      
      res.on('end', function () {
        assert.fail('Response should not be sent')
        done()
      })
    })

    it('should error if service returns an error', done => {
      let getUserPayloadCache = sinon.stub().returns(Promise.reject(new Error('Testing error'))),
          getUserPayload = sinon.stub()

      let handlerStub = {
        getUserPayloadCache,
        getUserPayload
      }

      handlers = proxyquire('../../../../../app/api/routes/github-routes/github-routes', {
        '../../services/github-service': handlerStub
      })

      handlers.getUserPayloadCache(req, res, function (err) {
        assert(getUserPayloadCache.called)
        assert.equal(getUserPayload.called, false)
        assert.ok(err.message)
        assert.equal(err.message, 'Testing error')
        done()
      })
      
      res.on('end', function () {
        assert.fail('Response should not be sent')
        done()
      })
    })
  })

  describe('getUserPayload', () => {
    it('should send payload', done => {
      let getUserPayload = sinon.stub().returns(Promise.resolve({ message: 'testing' })),
          getUserPayloadCache = sinon.stub()

      let handlerStub = {
        getUserPayloadCache,
        getUserPayload
      }

      handlers = proxyquire('../../../../../app/api/routes/github-routes/github-routes', {
        '../../services/github-service': handlerStub
      })

      handlers.getUserPayload(req, res, function (err) {
        assert.fail('Next should not be called')
        done()
      })
      
      res.on('end', function () {
        let data = res._getData()
        assert(getUserPayload.called)
        assert.ok(data)
        assert.ok(data.message)
        assert.equal(data.message, 'testing')
        done()
      })
    })

    it('should error if service returns error', done => {
      let getUserPayload = sinon.stub().returns(Promise.reject(new Error('Testing error'))),
          getUserPayloadCache = sinon.stub()

      let handlerStub = {
        getUserPayloadCache,
        getUserPayload
      }

      handlers = proxyquire('../../../../../app/api/routes/github-routes/github-routes', {
        '../../services/github-service': handlerStub
      })

      handlers.getUserPayload(req, res, function (err) {
        assert(getUserPayload.called)
        assert.ok(err.message)
        assert.equal(err.message, 'Testing error')
        done()
      })
      
      res.on('end', function () {
        assert.fail('Response should not be sent')
        done()
      })
    })
  })
})