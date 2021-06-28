const mongoose = require('mongoose')

const CollectionSchema = new mongoose.Schema({
    id_user: String,
    id_character: String,
    edition: Number,
    level: Number,
    amount: Number,
    price: Number,
    tag: String
}, {versionKey: false})

module.exports = mongoose.models.Collection || mongoose.model('Collection', CollectionSchema)