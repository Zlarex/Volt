const mongoose = require('mongoose')

const WishSchema = new mongoose.Schema({
    id_user: String,
    id_character: String
}, {versionKey: false})

module.exports = mongoose.models.Wish || mongoose.model('Wish', WishSchema)