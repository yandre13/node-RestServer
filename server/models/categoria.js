const mongoose = require('mongoose')

let categoriaSchema = new mongoose.Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripción es obligatoria']
    },
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario'
    }
})


module.exports = mongoose.model('Categoria', categoriaSchema)