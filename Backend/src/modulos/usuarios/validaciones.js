// modulos/usuarios/validaciones.js
const { body } = require('express-validator');

const validarUsuario = [
  body('nombre')
    .isString().withMessage('El nombre debe ser texto.')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('apellidos')
    .isString().withMessage('Los apellidos deben ser texto.')
    .isLength({ min: 2, max: 100 }).withMessage('Los apellidos deben tener entre 2 y 100 caracteres.'),

  body('email')
    .isEmail().withMessage('El email debe ser válido.')
    .isLength({ max: 150 }).withMessage('El email no debe superar los 150 caracteres.')
];

const validarAuth = [
  body('username')
    .isString().withMessage('El nombre de usuario debe ser texto.')
    .isLength({ min: 4, max: 100 }).withMessage('El nombre de usuario debe tener entre 4 y 100 caracteres.'),

  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
];

const validarRegistro = [...validarUsuario, ...validarAuth];

module.exports = {
  validarUsuario,
  validarAuth,
  validarRegistro
};
