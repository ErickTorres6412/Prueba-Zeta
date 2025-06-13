const { check, param } = require('express-validator');

exports.validacionAgregarCategoria = [
  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  check('descripcion')
    .optional()
    .isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres'),

  check('id')
    .optional()
    .isInt({ min: 0 }).withMessage('El ID debe ser un número entero positivo o cero')
];

exports.validacionActualizarCategoria = [
  check('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isInt({ min: 0 }).withMessage('El ID debe ser un número entero positivo'),

  check('nombre')
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres'),

  check('descripcion')
    .optional()
    .isLength({ max: 500 }).withMessage('La descripción no puede tener más de 500 caracteres')
];

exports.validacionEliminarCategoria = [
  check('id')
    .notEmpty().withMessage('El ID es obligatorio para eliminar')
    .isInt({ min: 1 }).withMessage('El ID debe ser un número entero positivo')
];

exports.validacionObtenerCategoria = [
  param('id')
    .notEmpty().withMessage('El ID es obligatorio')
    .isInt({ min: 0 }).withMessage('El ID debe ser un número entero positivo')
];
