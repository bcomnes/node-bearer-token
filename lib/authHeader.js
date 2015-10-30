var parseAuthHeader = require('auth-header').parse

function getAuthHeaderToken (req) {
  var headers = req.headers

  if (headers.authorization) {
    var authHeaders = parseAuthHeader(headers.authorization)
    var bearers = authHeaders.values.filter(isBearerHeader)
    var token = bearers.length > 0 ? bearers[0].token : ''
    return token
  }
}

function isBearerHeader (authHeader) {
  return authHeader.scheme === 'Bearer'
}

module.exports = getAuthHeaderToken
