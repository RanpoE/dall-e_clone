import express from 'express'
import * as dotenv from 'dotenv'
import { v2 as cloudinary} from 'cloudinary'

import Gallery from '../mongodb/models/gallery.js'

dotenv.config()

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Get all posts
router.route('/').get(async(req, res) => {
    try {
        const posts = await Gallery.find({})
        res.status(200).json({ success: true, data: posts })
    } catch (error) {
        res.status(500).send({ success: false, message: error })
    }

})
// Create post
router.route('/').post(async(req, res) => {
    try {
        const { user, title, caption, photo } = req.body
        const photoUrl = await cloudinary.uploader.upload(photo)
    
        const newGallery = await Gallery.create({
            user,
            title,
            caption,
            photo: photoUrl.url,
        })
    
        res.status(201).json({ success: true, data: newGallery})
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

// Delete post
router.route('/:id').delete(async(req, res) => {
    try {
        const { id } = req.params
        const deletedPost = await Gallery.findByIdAndDelete(id)
        res.status(200).json({ success: true, data: deletedPost })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

export default router;