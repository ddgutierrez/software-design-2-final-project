const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    idNumber: {
        type: Number,
        required: [true, 'Nro. de documento es requerido'],
        min: [0, 'Número de documento mínimo es 0, se suministró {VALUE}'],
        max: [9999999999, 'Número de documento máximo es 9999999999, se suministró {VALUE}'],
    },
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