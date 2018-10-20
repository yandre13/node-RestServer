require('./config/config')
const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    colors = require('colors'),
    c = console.log


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'))


mongoose.connect(process.env.URLDB, (err, res) => {

    if (err) {
        throw err
    }
    c(`Base de datos Online`.green)
})


app.listen(process.env.PORT, () => c(`Escuchando el puerto, ${process.env.PORT}`.green))