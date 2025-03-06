import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Server } from 'socket.io'
import { createServer } from 'http'

import connectDB from './mongodb/connect.js'
import LocationModel from './mongodb/models/location.js'


import postRoutes from './routes/postRoutes.js'
import dalleRoutes from './routes/dalleRoutes.js'
import pollyRoutes from './routes/pollyRoutes.js'
import galleyRoutes from './routes/galleryRoutes.js'
import authRoutes from './routes/authRoutes.js'
import expenseRoutes from './routes/expenseRoutes.js'
import locationRoutes from './routes/locationRoutes.js'

// import { Server as httpServ } from 'http'


dotenv.config()

const app = express()
const http = createServer(app)

// New features
let peers = []

// Socket functions
// const io = new Server(http, { cors: { origin: '*', methods: ["GET", "POST"] } })
// io.listen(4000)

// io.on('connection', (socket) => {
//     console.log('User has connected');

//     // peers.push(socket.id);

//     // socket.emit('peers', peers)
//     socket.on('offer', (data) => {
//         console.log(data)
//         // io.to(data.target).emit('offer', { offer: data.offer, sender: socket.id })
//     })

//     socket.on('update_location', async (locationData) => {
        
//         // await LocationModel.findOneAndUpdate(
//         //     {userId: socket.id},
//         //     locationData,
//         //     { upsert: true }
//         // )

//         socket.broadcast.emit('location_update', locationData)
//     })


//     socket.emit('message', { message: `Welcome on this server.` })
//     socket.on('disconnect', () => {
//         console.log('User has left')
//     })

// })

// Server routes

app.use(cors())
app.use(express.json({ limit: '50mb' }))

app.use('/api/v1/post', postRoutes)
app.use('/api/v1/dalle', dalleRoutes)
app.use('/api/v1/polly', pollyRoutes)
app.use('/api/v1/gallery', galleyRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/expense', expenseRoutes)
app.use('/api/v1/location', locationRoutes)

app.get('/', async (req, res) => {
    res.send('Hello from Server.')
})




const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL)
        app.listen(8080, () => console.log('Server has started on port 8080'))
    } catch (err) {
        console.log('MongoDB error ', err)
    }

}

startServer()