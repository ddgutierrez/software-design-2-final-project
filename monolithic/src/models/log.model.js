const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['crear usuario', 'leer usuario','actualizar usuario', 'eliminar usuario'],
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

module.exports = mongoose.model('Log', logSchema);