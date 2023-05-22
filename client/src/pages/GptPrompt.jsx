import React, { useEffect, useState } from 'react'
import { Message } from '../components'
import io from 'socket.io-client'

let socket
const GptPrompt = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const ENDPOINT = 'https://dall-e-api-h45e.onrender.com:8090'

  useEffect(() => {
    socket = io(ENDPOINT)

    socket.on('message', (data) => {
      setMessages([...messages, data])
    })

  }, [ENDPOINT])

  const handleChangeInput = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message) {
      console.log('sending message')
    }
  }

  return (
    <div className='h-screen'>
      <div className="w-full px-5 flex flex-col justify-between">
        <div className="flex flex-col mt-5">
          <div className="flex justify-end mb-4">
            {messages.map((msg, idx) => <Message key={idx} message={msg} />)}
          </div>
        </div>
        <div className="py-5">
          <input
            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
            type="text"
            placeholder="type your message here..."
            onChange={handleChangeInput}
            value={message}
            onKeyDown={event => { if (event.keyCode === 13) { handleSendMessage() } }}
          />
        </div>
      </div>
    </div>
  )
}

export default GptPrompt