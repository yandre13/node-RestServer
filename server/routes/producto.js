const express = require('express'),
    { verificarToken } = require('../middlewares/autenticacion'),
    Producto = require('../models/producto'),
    _ = require('underscore'),
    app = express()


//Obtener todos los productos

app.get('/producto', verificarToken, (req, res) => {

    let limit = req.query.limit || 10
    limit = Number(limit)
    let skip = req.params.skip || 0
    skip = Number(skip)

    Producto.find({ disponible: true }).limit(limit).skip(skip)
        .sort('nombre')
        .populate('usuario', 'nombre email role')
        .populate('categoria', 'descripcion usuario')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            Producto.count({ disponible: true }, (err, count) => {
                res.json({
                    ok: true,
                    producto: productos,
                    count
                })
            })
        })
})



//cargar los usuarios y categoria
//paginado
app.get('/producto/:id', verificarToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id).populate('usuario', 'nombre email role').populate('categoria', 'descripcion usuario').exec((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err,
                message: `No existe un producto con ese id `
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.get('/producto/buscar/:termino', verificarToken, (req, res) => {
    let termino = req.params.termino

    let regex = new RegExp(termino, 'i')
    Producto.find({ nombre: regex, disponible: true })
        .sort('nombre')
        .populate('categoria', 'descripcion').exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productosDB
            })
        })
})



//Crear un producto
app.post('/producto', verificarToken, (req, res) => {
    let usuario = req.usuario
    let body = req.body
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: usuario._id
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            message: 'El producto ha sido creado',
            producto: productoDB
        })
    })
})


//usuario
//grabar categoría





//Actualizar un producto

app.put('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario'])

    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoUp) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoUp) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            })
        }
        res.json({
            ok: true,
            message: 'Se ha actualizado el producto',
            producto: productoUp
        })
    })
})


app.delete('/producto/:id', verificarToken, (req, res) => {
    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'El producto no existe'
            })
        }
        if (productoDB.disponible === false) {
            return res.status(400).json({
                ok: false,
                message: 'El producto ya no está disponible'
            })
        }
        productoDB.disponible = false
        productoDB.save((err, productoD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                message: 'Se borrado el producto',
                producto: productoD
            })
        })

    })
})

module.exports = app