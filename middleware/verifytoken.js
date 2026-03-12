const jwt = require("jsonwebtoken")
const { jwtSecret } = require("../config/config")

const verifyToken = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization

    if (!authHeader) {
      return res.status(401).json({
        message: "Token required"
      })
    }

    const token = authHeader.split(" ")[1]

    const decoded = jwt.verify(token, jwtSecret)

    req.user = decoded   // 🔴 now req.user.id and req.user.role available

    next()

  } catch (error) {

    return res.status(401).json({
      message: "Invalid or expired token"
    })

  }

}

module.exports = verifyToken