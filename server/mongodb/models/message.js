import mongoose from "mongoose";

const Message = new mongoose.Schema({
    sender: { type: String, required: true },
    content: { type: String, required: true }
})

const MessageSchema = mongoose.model('Message', Message)

export default MessageSchema