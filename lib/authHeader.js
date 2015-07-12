var parseAuthHeader = require('auth-header').parse

function getAuthHeaderToken (req) {
  var headers = req.headers

  if (headers.authorization) {
    var authHeaders = parseAuthHeader(headers.authorization)
    var bearers = authHeaders.values.filter(isBearerHeader)
    var bearerToken = bearers[0].token
    console.log(bearerToken)
    if (bearers.length > 0) return bearers[0].token
  }
}

function isBearerHeader (authHeader) {
  return authHeader.scheme === 'Bearer'
}

module.exports = getAuthHeaderToken
