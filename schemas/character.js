const mongoose = require('mongoose')

const CharacterSchema = new mongoose.Schema({
    id_series: String,
    id_character: {
        type: String,
        unique: true
    },
    name: String,
    nickname: String,
    isTradable: Boolean,
    isSpecial: Boolean,
}, {versionKey: false})

module.exports = mongoose.models.Character || mongoose.model('Character', CharacterSchema)