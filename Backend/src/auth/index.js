const jwt = require('jsonwebtoken');
config = require('../config');

const secret = config.jwt.secret;

function asignarToken(data) {
    return jwt.sign(data, secret, { expiresIn: '24h' }); // Agregar expiración
}

function verificarToken(token) {
    return jwt.verify(token, secret);
}

const chequearToken = {
    confirmarToken: function(req){
        const decodificado = decodificarCabezera(req);
        return decodificado;
    }
}

function obtenerToken(autorizacion) {
    if (!autorizacion) {
        throw new Error('No se ha proporcionado el token');
    }

    if(autorizacion.indexOf('Bearer ') === -1) {
        throw new Error('El formato del token es incorrecto');
    }

    let token = autorizacion.replace('Bearer ', '');

    return token;
}

function decodificarCabezera(req) { 
    const autorizacion = req.headers.authorization || '';
    const token = obtenerToken(autorizacion);
    const decodificado = verificarToken(token);

    req.user = decodificado;
    return decodificado;
}

module.exports = {
    asignarToken,
    chequearToken,
};