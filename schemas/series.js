const mongoose = require('mongoose')

let SeriesSchema = new mongoose.Schema({
    id_series: {
        type: String,
        unique: true
    },
    name: {
        type: String,
        unique: true
    },
    source: String
}, {versionKey: false})

module.exports = mongoose.models.Series || mongoose.model('Series', SeriesSchema)