import mongoose from "mongoose";

const Expense = new mongoose.Schema({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date_created: { type: Date, default: Date.now },
})

const ExpenseModel = mongoose.model('Expense', Expense)

export default ExpenseModel