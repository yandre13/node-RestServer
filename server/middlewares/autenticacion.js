const jwt = require('jsonwebtoken')


// ====================
// verificarToken
// ====================

let verificarToken = (req, res, next) => {
    let token = req.get('token')
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no válido'
            })
        }
        req.usuario = decoded.usuario
        next()
    })
}

let verificarRole = (req, res, next) => {
    let usuario = req.usuario
    if (usuario.role === 'ADMIN_ROLE') {
        return next()
    }
    return res.json({
        message: 'Usuario no autorizado'
    })

}


module.exports = {
    verificarToken,
    verificarRole
}