var test = require('tape')
var request = require('request')
var http = require('http')
var portfinder = require('portfinder')

var authBody = require('../lib/authBody')
var fakeBearer = require('../lib/fakeBearer')

var port
var server

test('start authBody server', function (t) {
  portfinder.getPort(function (err, freePort) {
    if (err) return console.error(err)
    port = freePort
    server = http.createServer()
    server.listen(port, function () {
      t.pass('server started on ' + port)
      t.end()
    })
  })
})

test('get bearer token from request body', function (t) {
  var testToken = fakeBearer()
  var authReq = {
    method: 'POST',
    uri: 'http://localhost:' + port,
    form: {
      key: 'value',
      access_token: testToken
    }
  }

  var handler = function (req, res) {
    authBody(req, function (err, token) {
      t.error(err, 'no errors when finding body token')
      t.equal(token, testToken, 'should get bearer token from header')
      res.statusCode = 200
      res.end()
    })
  }

  server.on('request', handler)

  request(authReq, function (err, res, body) {
    t.error(err, 'no err on request')
    server.removeListener('request', handler)
    t.end()
  })
})

test('do not return auth header when missing', function (t) {
  var authReq = {
    method: 'POST',
    uri: 'http://localhost:' + port,
    form: {
      key: 'value'
    }
  }

  var handler = function (req, res) {
    authBody(req, function (err, token) {
      t.error(err, 'no errors when finding body token')
      t.equal(token, undefined, 'should not return a bearer token')
      res.statusCode = 400
      res.end()
    })
  }

  server.on('request', handler)

  request(authReq, function (err, res, body) {
    t.equal(res.statusCode, 400, 'missing status code returns 400')
    t.error(err, 'no err on request')
    server.removeListener('request', handler)
    t.end()
  })
})

test('do not return auth header when not urlencoded', function (t) {
  var authReq = {
    method: 'POST',
    uri: 'http://localhost:' + port
  }

  var handler = function (req, res) {
    authBody(req, function (err, token) {
      t.error(err, 'body token parsed without error')
      t.equal(token, undefined, 'should not return a bearer token')
      res.statusCode = 400
      res.end()
    })
  }

  server.on('request', handler)

  request(authReq, function (err, res, body) {
    t.equal(res.statusCode, 400, 'missing status code returns 400')
    t.error(err, 'no err on request')
    server.removeListener('request', handler)
    t.end()
  })
})

test('stop authHeader server', function (t) {
  server.close(function () {
    t.pass('server stopped')
    t.end()
  })
})
