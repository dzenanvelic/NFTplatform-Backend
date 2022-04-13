const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "You must be logged in" })
    }
    const token = await authorization.replace("Bearer ", "")
    //werify token
    jwt.verify(token, process.env.SECRET, async (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must be logged in" })
        }
        const { id } = payload
        const user = await User.findById(id)
        req.user = user
    })
    next()
}
module.exports = auth