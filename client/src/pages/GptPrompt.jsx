import React, { useEffect, useState, createRef, useRef } from 'react'
import { Message, WaveForm } from '../components'
import io from 'socket.io-client'
import axios from 'axios'

let socket
let name
const GptPrompt = () => {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [analyzerData, setAnalyzerData] = useState(null)
  const messageRef = createRef()
  const [audio, setAudio] = useState(null)
  const audioElmRef = useRef(null)

  const ENDPOINT = 'wss://jolly-phase-huckleberry.glitch.me/'

  useEffect(() => {
    socket = io(ENDPOINT)
    name = `user_${Math.floor(Math.random() * (1000 - 1 + 1) + 1)}`
    // console.log('useEffect')
    socket.emit('join', { name, room: 'Isekai' }, (error) => {
      if (error) alert("error");
    });
  }, [])

  const audioAnalyzer = () => {
    // create a new AudioContext
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    // create an analyzer node with a buffer size of 2048
    const analyzer = audioCtx.createAnalyser();
    analyzer.fftSize = 2048;

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const source = audioCtx.createMediaElementSource(audioElmRef.current);
    source.connect(analyzer);
    source.connect(audioCtx.destination);
    source.onended = () => {
      source.disconnect();
    };

    // set the analyzerData state with the analyzer, bufferLength, and dataArray
    setAnalyzerData({ analyzer, bufferLength, dataArray });
  };


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

  useEffect(() => {
    if (audioElmRef.current) audioAnalyzer()
  }, [audio])

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
    <section className='max-w-7xl m-auto flex flex-col  h-3/4 rounded-lg justify-between dark:bg-black'>
      <div className="relative w-full p-4 bg-white overflow-auto dark:bg-black" ref={messageRef}>
        {messages.map((msg, idx) => <Message key={idx} message={msg} name={name} />)}
        {analyzerData && <div className='max-w-7xl m-auto px-10 overflow-hidden' style={{ height: 120 }}>
          <WaveForm analyzerData={analyzerData} />
        </div>}
      </div>
      {audio && <audio ref={audioElmRef} autoPlay > <source src={audio} type="audio/mp3" /> </audio>}
      {messages.length > 0 &&
        <div className="flex flex-col">
          <input
            className="w-full bg-gray-300 py-5 px-3 rounded-xl"
            type="text"
            placeholder="type your message here..."
            onChange={handleChangeInput}
            value={message}
            onKeyDown={event => { if (event.key === 'Enter') { handleSendMessage() } }}
          />
        </div>
      }

    </section>
  )
}

export default GptPrompt