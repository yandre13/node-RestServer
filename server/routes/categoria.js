const express = require('express'),
    Categoria = require('../models/categoria'),
    _ = require('underscore'),
    { verificarToken, verificarRole } = require('../middlewares/autenticacion'),
    app = express()

//==================
//===Mostrar todas las categorias====
//==================
app.get('/categoria', verificarToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email role')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            })
        })
})

//==================
//===Mostrar todas las categorias====
//==================
app.get('/categoria/:id', verificarToken, (req, res) => {

        let id = req.params.id

        Categoria.findById(id, (err, categoria) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!categoria) {
                return res.status(400).json({
                    ok: false,
                    message: 'El id no es válido'
                })
            }
            res.json({
                ok: true,
                categoria,
                id
            })
        })
    })
    //==================
    //===Mostrar todas las categorias====
    //==================

app.post('/categoria', verificarToken, (req, res) => {

    let body = req.body
    let usuario = req.usuario
    console.log(usuario)
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id
    })

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

})




app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, 'descripcion')
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaUp) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaUp) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            message: 'La categoria ha sido actualizada',
            categoria: categoriaUp
        })
    })
})


app.delete('/categoria/:id', [verificarToken, verificarRole], (req, res) => {

    let id = req.params.id
    Categoria.findByIdAndDelete(id, (err, categoriaD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            })
        }
        res.json({
            ok: true,
            message: 'La categoria ha sido elimianda',
        })
    })
})

module.exports = app