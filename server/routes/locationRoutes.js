import express from 'express'
import * as dotenv from 'dotenv'
import LocationModel from '../mongodb/models/location.js'
import verifyToken from '../middlewares/verifyToken.js'
dotenv.config()

const router = express.Router()

router.route('/').get(async (req, res) => {
    const { userId } = req.query
    if (!userId) return res.status(500).json({ message: 'Missing queries' })
    try {
        const result = await LocationModel.find({
            userId
        })
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

export default router