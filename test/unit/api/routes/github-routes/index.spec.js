/**
 * Unit testing module for GitHub route paths
 * @requires assert
 * @requires express
 * @requires proxyquire
 * @requires sinon
 * @requires supertest
 * @requires ../../../../../app/api/routes/github-routes/
 */
const assert = require('assert')
const express = require('express')
const proxyquire = require('proxyquire')
const sinon = require('sinon')
const request = require('supertest')

describe('GitHub Routes', () => {
  let app, appRouter

  beforeEach(() => {
    app = express(),
    appRouter = express.Router()
  })

  describe('GET /githubPayload', () => {
    it('should call the getUserPayloadCache handler', done => {
      let getUserPayload = sinon.stub()
      let handlerStub = {
        getUserPayloadCache: function (req, res, next) { res.status(200).send({ message: 'getUserPayloadCache' }) },
        getUserPayload
      }

      proxyquire('../../../../../app/api/routes/github-routes', {
        './github-routes': handlerStub
      })(appRouter)

      app.use(appRouter)

      request(app)
        .get('/githubPayload')
        .expect(200)
        .end(function (err, res) {
          assert.equal(res.body.message, 'getUserPayloadCache')
          assert.equal(getUserPayload.called, false)
          done()
        })
    })

    it('should call the getUserPayload handler if payload not found in cache', done => {
      let handlerStub = {
        getUserPayloadCache: function (req, res, next) { next() },
        getUserPayload: function (req, res, next) { res.status(200).send({ message: 'getUserPayload' }) }
      }

      proxyquire('../../../../../app/api/routes/github-routes', {
        './github-routes': handlerStub
      })(appRouter)

      app.use(appRouter)

      request(app)
        .get('/githubPayload')
        .expect(200)
        .end(function (err, res) {
          assert.equal(res.body.message, 'getUserPayload')
          done()
        })
    })
  })
})