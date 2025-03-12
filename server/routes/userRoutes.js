import express from 'express'
import * as dotenv from 'dotenv'
import { getUsers } from '../mongodb/models/userFirebase.js'
import authenticateUser from '../middlewares/authUser.js'

dotenv.config()

const router = express.Router()

router.route('/').get(authenticateUser, async (req, res) => {
    try {
        const currentUserId = req.user.uid;
        const result = await getUsers(currentUserId)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

export default router