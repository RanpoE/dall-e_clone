import express from 'express'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'


dotenv.config()

const router = express.Router()

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(configuration)

router.route('/').get((req, res) => {
    res.send('Hello from DA VINCI')
})

router.route('/generate').post(async (req, res) => {
    try {
        const { prompt } = req.body
        const aiResponse = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt,
            max_tokens: 512,
        })
        const response = aiResponse.data.choices[0].text
        res.status(200).json({ success: true, message: response })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error })
    }
})

export default router