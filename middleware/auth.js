const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
  const token = req.signedCookies.auth_token
  if (!token)
    return res
      .status(401)
      .send({ message: 'Access denied. No token provided.' })

  try {
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY)
    req.user = decoded
    next()
  } catch (ex) {
    res.status(400).send({ message: 'Invalid token.' })
  }
}
