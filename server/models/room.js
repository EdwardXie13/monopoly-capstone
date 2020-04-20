// ----------------------------------------------------------------------------------------------
//  External Dependencies
// ----------------------------------------------------------------------------------------------
const mongoose = require('mongoose');

// ----------------------------------------------------------------------------------------------
//  Schema Setup
// ----------------------------------------------------------------------------------------------
const roomSchema = new mongoose.Schema({
    name: { type: String, default: "Unnamed Room", unique: true },
    private: { type: Boolean, default: false },
    players: Array,
    roomId: String,
    password: String
});

module.exports = mongoose.model('room', roomSchema);