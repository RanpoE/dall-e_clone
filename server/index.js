import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'
import connectDB from './mongodb/connect.js'
import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'


dotenv.config()

const app = express()
const http = createServer(app)
const io = new Server(http, { cors: { origin: '*'}})

app.use(cors())
app.use(express.json({ limit: '50mb'}))

app.use('/api/v1/post', postRoutes)
app.use('/api/v1/dalle', dalleRoutes)

app.get('/', async (req, res) => {
    res.send('Hello from DALL-E')
})

const startServer = async (req, res) => {

    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(8080, () => console.log('Server has started on port 8080'))
    } catch (err) {
        console.log(err)
    }
    
}

io.on('connection', (socket) => {
    console.log('User has connected')
    socket.emit('message', {message: `Welcome on this server.`})
    socket.on('disconnect', () => {
        console.log('User has left')
    })

})

io.listen(9090)

startServer()