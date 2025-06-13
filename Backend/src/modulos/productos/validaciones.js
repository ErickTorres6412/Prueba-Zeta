// modulos/productos/validaciones.js
const { body } = require('express-validator');

const validarProducto = [
  body('nombre')
    .isString().withMessage('El nombre debe ser texto.')
    .isLength({ min: 3, max: 150 }).withMessage('El nombre debe tener entre 3 y 150 caracteres.'),

  body('descripcion')
    .isString().withMessage('La descripción debe ser texto.')
    .isLength({ min: 10 }).withMessage('La descripción debe tener al menos 10 caracteres.'),

  body('precio')
    .isFloat({ min: 1 }).withMessage('El precio debe ser un número positivo.'),

  body('categoria_id')
    .isInt({ min: 1 }).withMessage('La categoría debe ser un ID numérico válido mayor a 0.'),

  body('url_imagen')
    .optional({ nullable: true })
    .isURL().withMessage('La URL de la imagen debe ser una URL válida.')
];

module.exports = { validarProducto };
