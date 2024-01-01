import UserModel from "../../entities/user"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async(req, res, next) => {
    console.log('register')
    const email = req.body.email
    const password = req.body.password

    if (email == null || password == null) {
        return sendError(res)
    }
    
    try {
        const exists = await UserModel.exists({'email' : email})

        if (exists) {
            return sendError(res, 'user already registered')
        }
        
        const salt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, salt)

        const user = new UserModel({
            'email':email,
            'password':encryptedPassword
        })
        
        const newUser = await user.save()
        res.status(200).send(newUser)
    } catch (err) {
        return sendError(res, (err instanceof Error) ? 'failed registration: ' + err.message : 'failed registration')
    }        
}

const login = async(req, res, next) => {
    console.log('login')
    const email = req.body.email
    const password = req.body.password

    if (email == null || password == null) {
        return sendError(res, 'one of the fields is missing')
    }

    try {
        const user = await UserModel.findOne({'email':email})

        if (user == null) return sendError(res, 'user not found')

        const match = await bcrypt.compare(password, user.password)
        if (!match) return sendError(res, 'password is wrong')

        const accessToken = await jwt.sign(
            {"_id":user._id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.JWT_TOKEN_EXPIRATION}
        )

        const refreshToken = await jwt.sign(
            {"_id":user._id},
            process.env.REFRESH_TOKEN_SECRET,            
        )

        res.status(200).send({
            'accessToken':accessToken,
            'refreshToken':refreshToken
        })
    } catch(err) {
        return sendError(res, (err instanceof Error) ? 'failed login: ' + err.message : 'failed login')
    }
}

const sendError = (res, message?) => {
    return res.status(400).send({
        'status' : 'fail',
        'message' : message == null ? 'unknown error' : message
    })   
}

const logout = async(req, res, next) => {
    console.log('logout')
    res.status(400).send({
        'status' : 'fail',
        'message' : 'not implemented'
    })   
}

const refreshToken = async(req, res, next) => {
    const authHeaders = req.headers.authorization
    const token = authHeaders 

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, userInfo) => {
        if (err) return res.status(403).send(err.message)
        const userId = userInfo._id

        try {
            const user = await UserModel.findById(userId)
            
            if (user == null) return res.status(403).send('Invalid request')
            
            if (!user.tokens.includes(token)) {
                user.tokens = []
                await user.save()
                return res.status(403).send('Invalid request')
            }

            const accessToken = await jwt.sign(
                {"_id":user._id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: process.env.JWT_TOKEN_EXPIRATION}
            )
    
            const refreshToken = await jwt.sign(
                {"_id":user._id},
                process.env.REFRESH_TOKEN_SECRET,            
            )

            user.tokens[user.tokens.indexOf(token)] = refreshToken
            await user.save()
            res.status(200).send({
                'accessToken':accessToken,
                'refreshToken':refreshToken
            })
        } catch (err) {
            return sendError(res, (err instanceof Error) ? 'refresh error: ' + err.message : 'refresh error')
        }
    }) 
}


export { register, login, logout, refreshToken };
