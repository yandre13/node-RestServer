const mongoose = require('mongoose'),
    uniqueValidator = require('mongoose-unique-validator')

let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}


let Schema = mongoose.Schema

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es requerida']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})
usuarioSchema.methods.toJSON = function() {
    let user = this
    let userObj = user.toObject()
    delete userObj.password
    return userObj
}
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema)