import React from 'react'
import { robo } from '../assets'

const Message = ({ message: { user, text }, name }) => {
    const sendByUser = user === name && true
    return (
        sendByUser ?
            <div className="flex justify-end mb-4">
                <div
                    className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white"
                >{text}
                </div>
                <img
                    src="https://source.unsplash.com/vpOeXr5wmR4/600x600"
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                />
            </div> :
            <div className="flex justify-start mb-4">
                <img
                    src={user === 'gpt' ? robo : "https://source.unsplash.com/vpOeXr5wmR4/600x600"}
                    className="object-cover h-8 w-8 rounded-full"
                    alt=""
                />
                <div
                    className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white"
                >{text}
                </div>
            </div>
    )
}

export default Message