import express from 'express'
import * as dotenv from 'dotenv'
import ExpenseModel from '../mongodb/models/expenses.js'
import verifyToken from '../middlewares/verifyToken.js'
dotenv.config()

const router = express.Router()

router.route('/').get(async (req, res) => {
    const { date, owner } = req.query
    try {
        const result = await ExpenseModel.find({
            date_created: {
                $gt: new Date(date)
            },
            owner
        })
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).json({ message: error })
    }
})

router.route('/').post(async (req, res) => {
    try {
        const { name, amount, owner } = req.body
        console.log(req.body)

        const newPost = await ExpenseModel.create({
            name,
            amount,
            owner
        })

        res.status(201).json({ success: true, data: newPost })
    } catch (error) {
        res.status(500).json({ success: false, message: error })
    }
})

router.route('/:id').get(async (req, res) => {
    const { id } = req.params
    try {
        const result = await ExpenseModel.findById(id)
        return res.status(200).send(result)
    } catch (error) {
        return res.status(500).json({ message: 'No result found' })
    }
})

router.route('/:id').delete(async (req, res) => {
    const { id } = req.params
    try {
        await ExpenseModel.findByIdAndDelete(id)
        return res.status(200).json({ message: 'Record deleted.'})
    } catch (error) {
        return res.status(500).json({ message: 'No result found.' })
    }
})

export default router