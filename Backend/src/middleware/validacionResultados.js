// middleware/validacionResultados.js
const { validationResult } = require('express-validator');
const respuesta = require('../red/respuestas');

function validarCampos(req, res, next) {
    const errores = validationResult(req);

    if (!errores.isEmpty()) {
        return respuesta.error(
            req,
            res,
            errores.array().map(e => e.msg),
            400
        );
    }

    next();
}

module.exports = validarCampos;
