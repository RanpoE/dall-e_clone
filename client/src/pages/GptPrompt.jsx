import React, { useEffect, useState } from 'react'
import { Message } from '../components'
import io from 'socket.io-client'

let socket
let name
const GptPrompt = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const ENDPOINT = 'wss://jolly-phase-huckleberry.glitch.me/'
  
  useEffect(() => {
    socket = io(ENDPOINT)
    name = `user_${Math.floor(Math.random() * (1000 - 1 + 1) + 1)}`
    // console.log('useEffect')
    socket.emit('join', { name, room: 'Isekai' }, (error) => {
			if (error) alert(error);
		});
    
  }, [])

  useEffect(() => {
		socket.on('message', (message) => {
			setMessages([...messages, message]);
		});
	}, [messages]);


  const handleChangeInput = (e) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message) {
      socket.emit('message', message, () => { setMessage('')})
      console.log('sending message')
    }
  }

  return (
    <div className='w-full px-5 flex flex-col rounded-lg justify-between'>
      <div className="w-full p-5 mt-5 bg-white overflow-x-auto" style={{height: '70vh'}}>
            {messages.map((msg, idx) => <Message key={idx} message={msg} name={name} />)}
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
  )
}

export default GptPrompt