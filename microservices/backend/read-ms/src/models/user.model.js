const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  idType: {
    type: String, 
    required: [true, 'Tipo de documento es requerido'],
    enum: {
      values: ['Tarjeta de identidad', 'Cedula'], 
      message: '{VALUE} no es un tipo de documento'
    }, 
  },
  idNumber: {
    type: Number,
    required: [true, 'Nro. de documento es requerido'],
    unique: [true, 'Nro. de documento ya esta en uso'],
    min: [0, 'Número de documento mínimo es 0, se suministró {VALUE}'],
    max: [9999999999, 'Número de documento máximo es 9999999999, se suministró {VALUE}'],
  },
  firstName: {
    type: String,
    required: [true, 'Primer Nombre es requerido'],
    maxLength: [30, 'No se permiten nombres con más de 30 caracteres'],
    validate:{ 
      validator: (str) => isNaN(str),
      message: 'No se permiten números como nombres',
    },
  },
  middleName: {
    type: String,
    required: false,
    maxLength: [30, 'No se permiten nombres con más de 30 caracteres'],
    validate:{ 
      validator: (str) => isNaN(str),
      message: 'No se permiten números como nombres',
    },
  },
  lastName: {
    type: String,
    required: [true, 'Apellido es requerido'],
    maxLength: [60, 'No se permiten apellidos con más de 60 caracteres'],
    validate:{ 
      validator: (str) => isNaN(str),
      message: 'No se permiten números como apellidos',
    },
  },
  birthDate: {
    type: Date,
    required: [true, 'Fecha de Nacimiento es requerida'],
  },
  gender: {
    type: String,
    required: [true, 'Género es requerido'],
    enum: {
      values: ['Masculino', 'Femenino', 'No binario', 'Prefiero no reportar'], 
      message: '{VALUE} no es una opción de género'
    },
  },
  email: {
    type: String,
    required: [true, 'Correo electrónico es requerido'],
    //unique: [true, 'Este correo electrónico ya esta en uso'],
    match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, '{VALUE} no es un correo electrónico válido']
  },
  phone: {
    type: String,
    required: [true, 'Celular es requerido'],
    match: [/^\d{10}$/, 'El número de celular tiene que ser de 10 caracteres']
  },
  photo: {
    type: String, 
    required: [false, 'Foto es requerida'],
    max: [2097152, 'El tamaño del archivo no puede superar los 2 MB'], // 2MB = 2097152B
  },
});

module.exports = mongoose.model('Users', userSchema);
