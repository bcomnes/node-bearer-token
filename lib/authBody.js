var formBody = require('body/form')

function parseAuthHeader (req, cb) {
  var headers = req.headers
  if (isUrlEncoded(headers)) {
    formBody(req, function (err, body) {
      if (err) return cb(null)
      cb(null, body.access_token)
    })
  } else {
    process.nextTick(cb, 0)
    return
  }
}

function isUrlEncoded (headers) {
  return headers['content-type'] === 'application/x-www-form-urlencoded'
}

module.exports = parseAuthHeader
