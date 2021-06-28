const mongoose = require('mongoose')

const ServerSchema = new mongoose.Schema({
    id_guild: {
        type: String,
        unique: true
    },
    id_channel: String,
    prefix: String,
    timezone: String
}, {versionKey: false})

module.exports = mongoose.models.Server || mongoose.model('Server', ServerSchema)