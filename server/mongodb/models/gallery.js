import mongoose from "mongoose";

const Gallery = new mongoose.Schema({
    user: { type: String, required: true},
    title: { type: String, required: true},
    caption: { type: String, required: true},
    photo: { type: String, required: true},
})

const GallerySchema = mongoose.model('Gallery', Gallery)

export default GallerySchema