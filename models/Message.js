const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        ref: 'User'
    },
    reciever: {
        type: String,
        ref: 'User'
    },
    text: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Message', messageSchema)