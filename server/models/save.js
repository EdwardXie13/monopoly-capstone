const mongoose = require('mongoose');

const saveSchema = new mongoose.Schema({
    roomCode: String,
    gamers: mongoose.Schema.Types.Mixed,
    board: Array,
    chanceCards: Array,
    communityCards: Array,
    turnIdx: Number
});

module.exports = mongoose.model('save', saveSchema);