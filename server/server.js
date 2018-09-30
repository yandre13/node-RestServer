require('./config/config')
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    c = console.log


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', (req, res) => {
    res.json('getUsuario')
})
app.post('/usuario', (req, res) => {


    let body = req.body

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es necesario'
        })
    } else {
        res.json({
            body
        })
    }
})
app.put('/usuario/:id', (req, res) => {
    let id = req.params.id
    res.json({
        id
    })
})
app.delete('/usuario', (req, res) => {
    res.json('deleeUsuario')
})

app.listen(process.env.PORT, () => c('Escuchando el puerto', process.env.PORT))