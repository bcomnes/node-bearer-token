var formBody = require('body/form')
var nextTick = require('process-nextick-args')

function parseAuthHeader (req, cb) {
  var headers = req.headers
  if (req.body && req.body.access_token) {
    // if express already parsed the req
    return nextTick(cb, null, req.body.access_token)
  } else if (isUrlEncoded(headers)) {
    // if req is still a stream
    formBody(req, function (err, body) {
      if (err) return cb(null)
      cb(null, body.access_token)
    })
  } else {
    return process.nextTick(cb)
  }
}

function isUrlEncoded (headers) {
  return headers['content-type'] === 'application/x-www-form-urlencoded'
}

module.exports = parseAuthHeader
