import express from 'express'
import * as dotenv from 'dotenv'
import AWS from 'aws-sdk'
import { Configuration, OpenAIApi } from 'openai'
import fs from 'fs'


dotenv.config()

const mimeType = 'audio/mp3'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
})

const configuration = new Configuration({
    apiKey: process.env.OPEN_API_KEY
})

const openai = new OpenAIApi(configuration)

const router = express.Router()

router.route('/').get((req, res) => {
    res.status(200).send('Polly main route')
})

// Ask gpt and generate audio file
router.route('/generate').post(async (req, res) => {
    const { text } = req.body

    const aiResponse = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: text,
        max_tokens: 512,
    })

    const response = aiResponse.data.choices[0].text
    try {
        const polly = new AWS.Polly()
        const params = {
            OutputFormat: 'mp3',
            Text: response,
            VoiceId: 'Joanna',
        }
        polly.synthesizeSpeech(params, (err, data) => {
            if (err) return res.status(500).send(err)
            fs.writeFile('speech.mp3', data.AudioStream, (err) => {
                if (err) return res.status(500).send(err)
                res.setHeader('Content-type', mimeType)
                fs.readFile('speech.mp3', (err, data) => {
                    if (err) return res.status(500).send(err)
                    res.status(200).send(data)
                })
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})

router.post('/audio', async (req, res) => {
    const { message } = req.body

    try {
        const polly = new AWS.Polly()
        const params = {
            OutputFormat: 'mp3',
            Text: message,
            VoiceId: 'Joanna',
        }
        polly.synthesizeSpeech(params, (err, data) => {
            if (err) return res.status(500).send(err)
            fs.writeFile('audio.mp3', data.AudioStream, (err) => {
                if (err) return res.status(500).send(err)
                res.setHeader('Content-type', mimeType)
                fs.readFile('audio.mp3', (err, data) => {
                    if (err) return res.status(500).send(err)
                    res.status(200).send(data)
                })
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})
export default router;