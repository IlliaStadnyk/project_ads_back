const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 10, maxlength: 50 },
    description: { type: String, required: true, minlength: 20, maxlength: 1000 },
    price: { type: Number, required: true},
    image: { type: String, required: true },
    date: { type: Date, required: false },
    location: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

module.exports = mongoose.model('Ad', adSchema);