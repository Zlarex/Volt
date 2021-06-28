const mongoose = require('mongoose')

const AlbumSchema = new mongoose.Schema({
    id_user: String,
    id_character: String,
})

module.exports = mongoose.models.Album || mongoose.model('Album', AlbumSchema)