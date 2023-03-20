require('dotenv').config()
const express = require('express')
const http = require('http')
const app =express()
const server = http.createServer(app)

const { Deepgram } = require('@deepgram/sdk')
const deepgram = new Deepgram(process.env.DG_KEY)

const socket = require('socket.io')
const io = socket(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['POST', 'GET']
    }
})

const WebSocket = require('ws')
const wss = new WebSocket.Server({ port: 3002 })

wss.on('connection', (ws) => {
    const deepgramLive = deepgram.transcription.live({
        interim_results: true,
        punctuate: true,
        endpointing: true,
        vad_turnoff: 500,
    })

    deepgramLive.addListener('open', () => console.log('dg onopen'))
    deepgramLive.addListener('error', (error) => console.log({error}))

    ws.onmessage = (event) => console.log(event.data)
    ws.onclose = () => deepgramLive.finish()
    deepgramLive.addListener('transcriptReceived', (data) => ws.send(data))

})


// io.on('connection', (socket) => {
//     const deepgramLive = deepgram.transcription.live({
//         interim_results: true,
//         punctuate: true,
//         endpointing: true,
//         vad_turnoff: 500,
//     })

//     deepgramLive.addListener('open', () => console.log('dg onopen'))

//     socket.emit("me", socket.id)

//     socket.on("disconnect", () => {
//         deepgramLive.finish()
//         socket.broadcast.emit("callEnded")
//     })

//     socket.on("recording", (event) => { if (event) deepgramLive.send(event) }) 

//     deepgramLive.addListener('transcriptReceived', (data) => console.log(data))
    
//     socket.on("callUser", (data) => {
//         io.to(data.userToCall).emit("callUser", {signal: data.signalData, from: data.from, name: data.name})
//     })
//     socket.on("answerCall", (data) => 
//         io.to(data.to).emit("callAccepted", data.signal))
// })

// server.listen(5000, () => console.log(`Listening on PORT 5000`))