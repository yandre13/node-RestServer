const express = require('express'),
    bcrypt = require('bcrypt'),
    _ = require('underscore'),
    app = express(),
    Usuario = require('../models/usuario')


app.get('/usuario', (req, res) => {

    let desde = req.query.desde || 1
    let limit = req.query.limit || 10
    desde = Number(desde)
    limit = Number(limit)
    Usuario.find({ estado: true }, 'role nombre email estado').limit(limit).skip(desde - 1).exec((err, usuarios) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        Usuario.count({ estado: true }, (err, counts) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                usuarios,
                count: counts
            })
        })

    })


})

app.post('/usuario', (req, res) => {


    let body = req.body


    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })


})
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role'])
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })

})
app.delete('/usuario/:id', (req, res) => {

    let id = req.params.id
    let body = { estado: false }
    Usuario.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})


module.exports = app