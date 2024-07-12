import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import UserSchema from '../mongodb/models/user.js'

dotenv.config()

const SECRET_KEY = process.env.SECRET_KEY

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']
    console.log(req.headers)
    if (!token) return res.status(403).json({ message: 'Token is not provided' })

    jwt.verify(token, SECRET_KEY, async (err) => {

        if (err) return res.status(401).json({ message: 'Failed to authenticated token' })

        // Adding logs for route the user has visited.
        const user = await UserSchema.findOne({ token })

        if (!user) return res.status(404).json({ message: 'User not found' })

        user.logs.push({ route: req.originalUrl })
        await user.save()

        next()
    })
}


export default verifyToken