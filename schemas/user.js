const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    id_user: {
        type: String,
        unique: true
    },
    // Cooldown
    lastDaily: Number,
    lastVote: Number,
    lastWeekly: Number,
    lastDrop: Number,
    // Economy
    gold: Number,
    platinum: Number,
    isPremium: Boolean,
}, {versionKey: false})

module.exports = mongoose.models.User || mongoose.model('User', UserSchema)