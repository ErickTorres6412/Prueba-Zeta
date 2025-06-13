const auth = require('.');
const respuestas = require('../red/respuestas');

function chequearToken(){
    return function(req, res, next) {
        try {
            auth.chequearToken.confirmarToken(req); 
            next();
        } catch (error) {
            next(error); 
        }
    }
}

function chequearRol(rolesPermitidos = []) {
    return function(req, res, next) {
        try {
            auth.chequearToken.confirmarToken(req);
            
            if (rolesPermitidos.length > 0) {
                const userRole = req.user.role;
                
                if (!rolesPermitidos.includes(userRole)) {
                    return respuestas.error(req, res, 'No tienes permisos para acceder a este recurso', 403);
                }
            }
            
            next();
        } catch (error) {
            next(error); 
        }
    }
}

function soloAdmin() {
    return chequearRol(['admin']);
}

function adminOUser() {
    return chequearRol(['admin', 'user']);
}

module.exports = {
    chequearToken,
    chequearRol,
    soloAdmin,
    adminOUser
};