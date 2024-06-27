import mongoose from "mongoose";

const User = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, minLength: 6, required: true },
    role: { type: String, default: 'Basic', required: true },
    token: { type: String },
    logs: [{ route: String, timestamp: { type: Date, default: Date.now } }],
})

const UserSchema = mongoose.model('User', User)

export default UserSchema