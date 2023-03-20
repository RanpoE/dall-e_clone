import React, { useRef, useState, useEffect } from 'react'
import Peer from 'simple-peer'
import io from 'socket.io-client'


// const socket = io.connect('http://localhost:5000')

const Meet = () => {
    const [stream, setStream] = useState()
    const [me, setMe] = useState('')
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState('')
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState('')
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')
    const [affirmation, setAffirmation] = useState('')

    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()
    const socketRef = useRef(null)

    // useEffect(() => {
    //     navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
    //         if (!MediaRecorder.isTypeSupported('audio/webm')) return alert('Not supported')

    //         const mediaRecorder = new MediaRecorder(stream, {
    //             mimeType: 'audio/webm'
    //         })

    //         const socket = new WebSocket('ws://localhost:3002')
            
    //         socket.onopen = () => {
    //             mediaRecorder.addEventListener('dataavailable', async (event) => {
    //                 console.log(event.data.size)
    //                 if(event.data.size > 0 ) {
    //                     console.log('streaming', event.data)
    //                     socket.send(event.data)
    //                 }
    //             })
                
    //             mediaRecorder.start(1000)               
    //         }

    //         socket.onmessage = (message) => {
    //             const received = JSON.parse(message.data)
    //             const transcript = received.channel.alternatives[0].transcript
    //             if(transcript) {
    //                 console.log(transcript)
    //                 setAffirmation(transcript)
    //             }
    //         }
    //         socketRef.current = socket

    //     })

    // }, [])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on('signal', (data) => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: me,
                name: name
            })
        })
        peer.on('stream', (stream) => {
            userVideo.current.srcObject = stream
            stream.addEventListener('')
        })

        socket.on('callAccepted', (signal) => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on('signal', (data) => {
            socket.emit('answerCall', { signal: data, to: caller })
        })

        peer.on('stream', (stream) => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }

    return (
        <div>
            <h1>Room for meetups</h1>
            <h4>{me}</h4>
            <div>
                {
                    stream ? <video playsInline ref={myVideo} autoPlay style={{ width: '300px' }} /> : <p>Nani</p>
                }
            </div>
            <div className='video2'>
                {callAccepted && !callEnded ?
                    <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} /> :
                    null
                }
            </div>
            <div>
                <input type='text' placeholder='Set name' value={name} onChange={(e) => setName(e.target.value)} /> <br />
                <input type='text' placeholder='id to call' value={idToCall} onChange={(e) => setIdToCall(e.target.value)} />
                {callAccepted && !callEnded ? (
                    <button onClick={leaveCall}>End Call</button>
                ) : (
                    <button onClick={() => callUser(idToCall)}>Call user</button>
                )}
            </div>
            <div>
                {receivingCall && !callAccepted ? (
                    <div>
                        <h1>{caller} is calling..</h1>
                        <button onClick={answerCall}>
                            Answer
                        </button>
                    </div>
                ) : null}
            </div>
            <div>
                Transcription here:
                {affirmation && <p>{affirmation}</p>}
            </div>
        </div>
    )
}

export default Meet