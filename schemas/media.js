const mongoose = require('mongoose')

const MediaSchema = new mongoose.Schema({
    id_character: String,
    edition: Number,
    url: String,
}, {versionKey: false})

module.exports = mongoose.models.Media || mongoose.model('Media', MediaSchema)