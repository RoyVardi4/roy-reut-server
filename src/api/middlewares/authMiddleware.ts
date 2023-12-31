import jwt from "jsonwebtoken"

const authenticate = async(req,res,next) => {
    const authHeaders = req.headers.authorization
    const token = authHeaders 

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).send(err.message)
        req.user = user
        next()
    })
}

export {authenticate}