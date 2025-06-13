const { check } = require('express-validator');

exports.validacionLogin = [
  check('username')
    .notEmpty().withMessage('El username es obligatorio')
    .isLength({ min: 6, max: 50 }).withMessage('El username debe tener entre 6 y 50 caracteres'),

  check('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
];
