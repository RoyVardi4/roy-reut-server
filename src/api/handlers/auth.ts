import UserModel from "../../entities/user"

    const login = async(req, res, next) => {
        console.log('login')
        res.status(400).send({
            'status' : 'fail',
            'message' : 'not implemented'
        })    
    }

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

            const user = new UserModel({
                'email':email,
                'password':password
            })

            const newUser = await user.save()
            res.status(200).send(newUser)
        } catch (err) {
            return sendError(res)
        }        
    }

    const sendError = (res, message?) => {
        return res.status(400).send({
            'status' : 'fail',
            'message' : message == null ? 'not implemented' : message
        })   
    }

    const logout = async(req, res, next) => {
        console.log('logout')
        res.status(400).send({
            'status' : 'fail',
            'message' : 'not implemented'
        })   
    }

    export { register, login, logout };
