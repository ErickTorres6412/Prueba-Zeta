const express = require('express');
const respuestas = require('../../red/respuestas');
const controlador = require('./index');
const { soloAdmin, adminOUser } = require('../../auth/seguridad');
const { validarProducto } = require('./validaciones');
const validarCampos = require('../../middleware/validacionResultados');

const router = express.Router();

router.get('/', adminOUser(), todos);
router.get('/:id', adminOUser(), uno);
router.delete('/', soloAdmin(), eliminar);
router.post('/', soloAdmin(), validarProducto, validarCampos, agregar);
router.put('/', soloAdmin(), validarProducto, validarCampos, actualizar); 

async function todos(req, res, next) {
  try {
    const items = await controlador.todos();
    respuestas.success(req, res, items, 200);
  } catch (error) {
    next(error);
  }
};

async function uno(req, res, next) {
  try {
    const items = await controlador.uno(req.params.id);
    respuestas.success(req, res, items, 200);
  } catch (error) {
    next(error);
  }
};

async function agregar(req, res, next) {
  try {
    await controlador.agregar(req.body);
    const mensaje = 'Producto agregado correctamente';
    respuestas.success(req, res, mensaje, 201);
  } catch (error) {
    next(error);
  }
};

async function actualizar(req, res, next) {
  try {
    await controlador.actualizar(req.body);
    const mensaje = 'Producto actualizado correctamente';
    respuestas.success(req, res, mensaje, 201);
  } catch (error) {
    next(error);
  }
};

async function eliminar(req, res, next) {
  try {
    await controlador.eliminar(req.body);
    respuestas.success(req, res, 'Producto eliminado correctamente', 200);
  } catch (error) {
    next(error);
  }
};

module.exports = router;
