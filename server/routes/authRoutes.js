import express from 'express'
import * as dotenv from 'dotenv'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from '../mongodb/models/user.js'

dotenv.config()

const router = express.Router()
const SECRET_KEY = process.env.SECRET_KEY

router.route('/').get((req, res) => {
    res.send('Hello from auth')
})

router.route('/signup').post(async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) return res.status(400).json({ message: "Complete the fields" })

    if (password.length < 6) return res.status(400).json({ message: "Password is less than 6 characters" })
    try {
        const token = jwt.sign( {username }, SECRET_KEY, { expiresIn: '1h'})

        bcryptjs.hash(password, 10).then(async (hash) => {
            await User.create({
                username,
                password: hash,
                token,
            }).then(user => res.status(201).json({
                message: "User created",
                user
            }))
        }).catch((err) => res.status(400).json({ message: "Hashing issue", error: err.message }))
    } catch (error) {
        res.status(401).json({ message: "User not created", error: error.message })
    }
})

router.route('/login').post(async (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.status(400).json({ message: "Complete the fields" })
    try {
        const user = await User.findOne({ username })
        if (!user) return res.status(404).json({ message: "Login failed", error: "User not found" })

        const token = jwt.sign({ id: user._id }, SECRET_KEY, {expiresIn: '1h'})
        user.token = token
        
        bcryptjs.compare(password, user.password).then(result =>
            result ? res.status(200).json({ message: "Login successful", user }) :
                res.status(401).json({ message: "Login failed." }))
    } catch (error) {
        res.status(400).json({ message: "Encountered some issue", error: error.message })
    }
})

router.route('/update').patch(async (req, res) => {
    const { role, id } = req.body
    if (!role || !id) return res.status(400).json({ message: "Complete the fields" })
    if (role !== 'admin') return res.status(400).json({ message: "Role is not an admin" })
    await User.findById(id)
        .then(user => {
            if (user.role === role) return res.status(400).json({ message: "User was already an admin." })
            if (user.role !== 'admin') {
                user.role = role
                user.save((err) => {
                    if (err) res.status(400).json({ message: "Update error", error: err.message });
                    res.status(201).json({ message: "Update complete", user })
                })
            }
        }).catch((err) => res.status(400).json({ message: "Scanning user error", error: err.message }))
})


export default router;