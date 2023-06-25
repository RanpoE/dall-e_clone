import React, { useEffect, useState, createRef, useRef } from 'react'
import { Message } from '../components'
import io from 'socket.io-client'
import axios from 'axios'

let socket
let name
const GptPrompt = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const messageRef = createRef()
  const [audio, setAudio] = useState(null)

  const ENDPOINT = 'wss://jolly-phase-huckleberry.glitch.me/'

  useEffect(() => {
    socket = io(ENDPOINT)
    name = `user_${Math.floor(Math.random() * (1000 - 1 + 1) + 1)}`
    // console.log('useEffect')
    socket.emit('join', { name, room: 'Isekai' }, (error) => {
      if (error) alert(error);
    });
  }, [])

  const getAudio = async () => {

    const modMessage = message.toLowerCase()
    modMessage.split('Narra')[1]
    const data = {
      text: modMessage
    }
    await axios({ method: 'post', url: 'https://dall-e-api-h45e.onrender.com/api/v1/polly/generate', data, responseType: 'arraybuffer' })
      .then(res => {
        const audioData = res.data;
        const blob = new Blob([audioData], { type: 'audio/mp3' })
        const url = URL.createObjectURL(blob);
        setAudio(url)
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    });
    const scroll = messageRef.current.scrollHeight - messageRef.current.clientHeight;
    messageRef.current.scrollTo(0, scroll)
  }, [messages]);


  const handleChangeInput = (e) => {
    setMessage(e.target.value)
  }


  const handleSendMessage = () => {
    if (message) {
      setAudio(null)
      // getAudio()
      let lowMessage = message.toLocaleLowerCase()
      if (lowMessage.includes('narra')) getAudio()
      socket.emit('message', message, () => { setMessage('') })
      console.log('sending message')
    }
  }

  return (
    <section className='max-w-7xl m-auto flex flex-col h-3/4 rounded-lg justify-between'>
      <div className="w-full px-4 bg-white overflow-auto" ref={messageRef}>
        {messages.map((msg, idx) => <Message key={idx} message={msg} name={name} />)}
      </div>
      {audio && <audio autoPlay> <source src={audio} type="audio/mp3" /> </audio>}
      <div className="">
        <input
          className="w-full bg-gray-300 py-5 px-3 rounded-xl"
          type="text"
          placeholder="type your message here..."
          onChange={handleChangeInput}
          value={message}
          onKeyDown={event => { if (event.keyCode === 13) { handleSendMessage() } }}
        />
      </div>
    </section>
  )
}

export default GptPrompt