var test = require('tape')
var request = require('request')
var http = require('http')
var portfinder = require('portfinder')
var crypto = require('crypto')

var bearer = require('../lib/authHeader')

var port
var server

function fakeBearer () {
  return crypto.randomBytes(64).toString('base64')
}

test('start a server', function (t) {
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

test('get auth header from request', function (t) {
  var testToken = fakeBearer()
  var authReq = {
    method: 'POST',
    uri: 'http://localhost:' + port,
    auth: {
      bearer: testToken
    }
  }

  var handler = function (req, res) {
    var token = bearer(req)
    t.equal(token, testToken, 'should get bearer token from header')
    res.statusCode = 200
    res.end()
  }

  server.on('request', handler)

  request(authReq, function (err, res, body) {
    t.error(err, 'no err on request')
    server.removeListener('request', handler)
    t.end()
  })

})

test('stop the server', function (t) {
  server.close(function () {
    t.pass('server stopped')
    t.end()
  })
})
