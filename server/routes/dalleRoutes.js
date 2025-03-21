import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'
import verifyToken from '../middlewares/verifyToken.js'
import authenticateUser from '../middlewares/authUser.js'
dotenv.config()

const router = express.Router()

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(configuration)

router.route('/').get(authenticateUser, (req, res) => {
    res.send('Hello from dalle')
})

router.route('/generate').post(async (req, res) => {
    try {
        const { prompt } = req.body
        const aiResponse = await openai.createImage({
            prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        })
        const image = aiResponse.data.data[0].b64_json;
        res.status(200).json({
            photo: image
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error?.response.data.error.message)
    }

})

export default router;