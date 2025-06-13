const respuesta = require('./respuestas');

function error(error, req, res, next) {
    console.error(['Error'], error);

    const message = error.message || 'Internal Server Error';

    const status = error.statusCode || 500;

    respuesta.error(req, res, message, status);
}

module.exports = error;